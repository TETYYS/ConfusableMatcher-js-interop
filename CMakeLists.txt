cmake_minimum_required(VERSION 3.0)
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_VERBOSE_MAKEFILE ON)

project(confusablematcher-js-interop-native)

# CMake
include_directories(${CMAKE_JS_INC})

find_package(Threads)

set(INSTALL_HAYAI FALSE CACHE BOOL "")
set(BUILD_HAYAI_TESTS FALSE CACHE BOOL "")
set(BUILD_HAYAI_SAMPLES FALSE CACHE BOOL "")

add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")

include(CheckIncludeFileCXX)
check_include_file_cxx(experimental/string_view HAVE_EXPERIMENTAL_STRING_VIEW)

configure_file(${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/Config.h.in ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/Config.h)

# Define NAPI Version
add_compile_definitions(NAPI_VERSION=${napi_build_version})

# Include Project
file(GLOB SOURCE_FILES "src/*.cpp" "src/*.h")
add_library(${PROJECT_NAME} SHARED
    ${SOURCE_FILES}
    "src/ConfusableMatcher/ConfusableMatcher.cpp"
    "src/ConfusableMatcher/ConfusableMatcher.h"
    "src/ConfusableMatcher/Config.h"
    "src/ConfusableMatcher/Shared.h"
    "src/ConfusableMatcher/ConfusableMatcherData.cpp"
    ${CMAKE_JS_SRC}
)
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${CMAKE_THREAD_LIBS_INIT})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)

include_directories(${PROJECT_NAME} ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/plf_stack)
include_directories(${PROJECT_NAME} ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/sparsehash/build/src)
include_directories(${PROJECT_NAME} ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/sparsehash/src)
if (WIN32)
	include_directories(${PROJECT_NAME} "src/ConfusableMatcher/sparsehash/src/windows")
endif()
if(MSVC)
	string(APPEND CMAKE_CXX_FLAGS " /Zc:__cplusplus")
endif()

if (NOT WIN32)
	file(MAKE_DIRECTORY ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/sparsehash/build)

	add_custom_target(
		SparsehashConfig
		COMMAND ../configure CXXFLAGS="-Ofast"
		WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/sparsehash/build
	)

	add_custom_target(
		SparsehashBuild
		COMMAND make
		WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}/src/ConfusableMatcher/sparsehash/build
	)

	add_dependencies(SparsehashBuild SparsehashConfig)
	add_dependencies(${PROJECT_NAME} SparsehashConfig)
	add_dependencies(${PROJECT_NAME} SparsehashBuild)
endif()

# Include NAA Headers
execute_process(
    COMMAND
        node -p "require('node-addon-api').include"
        WORKING_DIRECTORY
        ${PROJECT_SOURCE_DIR}
        OUTPUT_VARIABLE
        NODE_ADDON_API_DIR
)
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
