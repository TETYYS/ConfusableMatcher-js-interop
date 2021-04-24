{
    "targets": [
                {
            "target_name": "confusable_matcher_cmake",
            "type": "none",
            "actions": [
                  {
                    "action_name": "cmake",
                    "inputs": [],
                    "outputs": [
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild/Makefile"
                    ],
                    "action": [
                        "cmake",
                        "-S"
                        "<(module_root_dir)/src/ConfusableMatcher",
                        "-B",
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild"
                    ]
                },
            ]
        },
        {
            "target_name": "confusable_matcher_make",
            "type": "none",
            "actions": [
                {
                    "action_name": "make",
                    "inputs": [
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild/Makefile"
                    ],
                    "outputs": [
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild/ConfusableMatcher.so"
                    ],
                    "action": [
                        "make",
                        "-C",
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild"
                    ]
                }
            ]
        },
        {
            "target_name": "action_before_build",
            "type": "none",
            "copies": [
                {
                    "files": [
                        "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild/ConfusableMatcher.so"
                    ],
                    "destination": "<(PRODUCT_DIR)"
                }
            ]
        },
        {
            "target_name": "confusablematcher-js-interop-native",
            "sources": [
                "<!@(find ./src -maxdepth 1 \\( -name '*.cpp' -o -name '*.h' \\) -print)"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "dependencies": [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            "libraries": [
                "<(module_root_dir)/src/ConfusableMatcher/CMakeBuild/ConfusableMatcher.so"
            ],
            "cflags!": [
                "-fno-exceptions",
                "-std=c++17"
            ],
            "cflags_cc!": [
                "-fno-exceptions"
            ],
            "xcode_settings": {
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                "CLANG_CXX_LIBRARY": "libc++",
                "MACOSX_DEPLOYMENT_TARGET": "10.7"
            },
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "ExceptionHandling": 1
                }
            },
            "link_settings": {
                "libraries": [
                    "-Wl,-rpath,'$$ORIGIN'"
                ]
            }
        }
    ]
}
