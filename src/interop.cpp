#include "interop.h"
#include "indexOfAsyncWorker.h"
#include "indexOfDebugFailuresAsyncWorker.h"

ConfusableMatcherNapiInterop::ConfusableMatcherNapiInterop(const Napi::CallbackInfo &info) : ObjectWrap(info) {
    Napi::Env env = info.Env();

    std::vector<std::pair<std::string, std::string>> mapVector;
    Napi::Array mapArray = info[0].As<Napi::Array>();
    for (uint32_t x = 0; x < mapArray.Length(); x++) {
        Napi::Array result = mapArray.Get(x).As<Napi::Array>();
        std::pair<std::string, std::string> kvPair = {
            result.Get((uint32_t)0).ToString().Utf8Value(), result.Get((uint32_t)1).ToString().Utf8Value()};
        mapVector.push_back(kvPair);
    }

    std::unordered_set<std::string> skipsSet;
    Napi::Array skipsArray = info[1].As<Napi::Array>();
    for (uint32_t x = 0; x < skipsArray.Length(); x++) {
        skipsSet.insert(skipsArray.Get(x).ToString().Utf8Value());
    }

    bool addDefaults = info[2].ToBoolean();

    try {
        this->_instance = new ConfusableMatcher(mapVector, skipsSet, addDefaults);
    } catch (const std::runtime_error &error) {
        throw Napi::Error::New(env, error.what());
    }
}

ConfusableMatcherNapiInterop::~ConfusableMatcherNapiInterop() { delete this->_instance; }

Napi::Value ConfusableMatcherNapiInterop::getKeyMappings(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    std::string key = info[0].ToString().Utf8Value();

    StackVector<CMString> mappings;
    this->_instance->GetKeyMappings(key, mappings);

    size_t size = mappings.Size();
    Napi::Array result = Napi::Array::New(env, size);
    for (size_t x = 0; x < size; x++) {
        result[x] = Napi::String::New(env, mappings.GetElement(x).Str);
    }

    return result;
}

Napi::Value ConfusableMatcherNapiInterop::computeStringPosPointers(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    std::string needle = info[0].ToString().Utf8Value();
    CMStringPosPointers *stringPosPointer = this->_instance->ComputeStringPosPointers(needle);
    return Napi::External<CMStringPosPointers>::New(info.Env(), stringPosPointer);
}

Napi::Value ConfusableMatcherNapiInterop::freeStringPosPointers(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    Napi::External<CMStringPosPointers> external = info[0].As<Napi::External<CMStringPosPointers>>();
    CMStringPosPointers *stringPosPointer = external.Data();
    this->_instance->FreeStringPosPointers(stringPosPointer);
    return env.Undefined();
}

Napi::Value ConfusableMatcherNapiInterop::indexOf(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    std::string in = info[0].ToString().Utf8Value();
    std::string needle = info[1].ToString().Utf8Value();
    Napi::Object optionsObject = info[2].As<Napi::Object>();

    CMOptions cmOpts = {};
    cmOpts.MatchRepeating = optionsObject.Get("matchRepeating").ToBoolean();
    cmOpts.StartIndex = optionsObject.Get("startIndex").ToNumber().Uint32Value();
    cmOpts.StartFromEnd = optionsObject.Get("startFromEnd").ToBoolean();
    cmOpts.TimeoutNs = optionsObject.Get("timeoutNs").ToNumber().Uint32Value();
    cmOpts.MatchOnWordBoundary = optionsObject.Get("matchOnWordBoundary").ToBoolean();

    auto posPointer = optionsObject.Get("needlePosPointers");
    if (!posPointer.IsNull()) {
        Napi::External<CMStringPosPointers> external = posPointer.As<Napi::External<CMStringPosPointers>>();
        CMStringPosPointers *stringPosPointer = external.Data();
        cmOpts.ContainsPosPointers = stringPosPointer;
    }

    CMReturn result = this->_instance->IndexOf(in, needle, cmOpts);

    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "size"), Napi::Number::New(env, result.Size));
    obj.Set(Napi::String::New(env, "start"), Napi::Number::New(env, result.Start));
    obj.Set(Napi::String::New(env, "status"), Napi::Number::New(env, result.Status));

    return obj;
}

Napi::Value ConfusableMatcherNapiInterop::indexOfAsync(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    Napi::Function callback = info[0].As<Napi::Function>();
    std::string in = info[1].ToString().Utf8Value();
    std::string needle = info[2].ToString().Utf8Value();
    Napi::Object optionsObject = info[3].As<Napi::Object>();

    CMOptions cmOpts = {};
    cmOpts.MatchRepeating = optionsObject.Get("matchRepeating").ToBoolean();
    cmOpts.StartIndex = optionsObject.Get("startIndex").ToNumber().Uint32Value();
    cmOpts.StartFromEnd = optionsObject.Get("startFromEnd").ToBoolean();
    cmOpts.TimeoutNs = optionsObject.Get("timeoutNs").ToNumber().Uint32Value();
    cmOpts.MatchOnWordBoundary = optionsObject.Get("matchOnWordBoundary").ToBoolean();

    auto posPointer = optionsObject.Get("needlePosPointers");
    if (!posPointer.IsNull()) {
        Napi::External<CMStringPosPointers> external = posPointer.As<Napi::External<CMStringPosPointers>>();
        CMStringPosPointers *stringPosPointer = external.Data();
        cmOpts.ContainsPosPointers = stringPosPointer;
    }

    ConfusableMatcherIndexOfAsyncWorker *worker =
        new ConfusableMatcherIndexOfAsyncWorker(callback, this->_instance, in, needle, cmOpts);
    worker->Queue();
    return env.Undefined();
};

Napi::Value ConfusableMatcherNapiInterop::indexOfDebugFailures(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    std::string in = info[0].ToString().Utf8Value();
    std::string needle = info[1].ToString().Utf8Value();
    Napi::Object optionsObject = info[2].As<Napi::Object>();

    CMOptions cmOpts = {};
    cmOpts.MatchRepeating = optionsObject.Get("matchRepeating").ToBoolean();
    cmOpts.StartIndex = optionsObject.Get("startIndex").ToNumber().Uint32Value();
    cmOpts.StartFromEnd = optionsObject.Get("startFromEnd").ToBoolean();
    cmOpts.TimeoutNs = optionsObject.Get("timeoutNs").ToNumber().Uint32Value();
    cmOpts.MatchOnWordBoundary = optionsObject.Get("matchOnWordBoundary").ToBoolean();

    auto posPointer = optionsObject.Get("needlePosPointers");
    if (!posPointer.IsNull()) {
        Napi::External<CMStringPosPointers> external = posPointer.As<Napi::External<CMStringPosPointers>>();
        CMStringPosPointers *stringPosPointer = external.Data();
        cmOpts.ContainsPosPointers = stringPosPointer;
    }

    std::vector<CMDebugFailure> rawFailures;
    CMReturn rawResult = this->_instance->IndexOfDebugFailures(in, needle, cmOpts, &rawFailures);

    Napi::Object result = Napi::Object::New(Env());
    result.Set(Napi::String::New(env, "size"), Napi::Number::New(env, rawResult.Size));
    result.Set(Napi::String::New(env, "start"), Napi::Number::New(env, rawResult.Start));
    result.Set(Napi::String::New(env, "status"), Napi::Number::New(env, rawResult.Status));

    size_t size = rawFailures.size();
    Napi::Object failures = Napi::Array::New(Env());
    for (size_t x = 0; x < size; x++) {
        uint64_t inPos = rawFailures[x].InPos;
        uint64_t containsPos = rawFailures[x].ContainsPos;
        CM_DEBUG_FAILURE_REASON reason = rawFailures[x].Reason;

        Napi::Object failure = Napi::Object::New(Env());
        failure.Set(Napi::String::New(this->Env(), "inPos"), Napi::Number::New(this->Env(), inPos));
        failure.Set(Napi::String::New(this->Env(), "containsPos"), Napi::Number::New(this->Env(), containsPos));
        failure.Set(Napi::String::New(this->Env(), "reason"), Napi::Number::New(this->Env(), reason));

        failures[x] = failure;
    }

    Napi::Object value = Napi::Object::New(Env());
    value.Set(Napi::String::New(this->Env(), "result"), result);
    value.Set(Napi::String::New(this->Env(), "failures"), failures);

    return value;
}

Napi::Value ConfusableMatcherNapiInterop::indexOfDebugFailuresAsync(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    Napi::Function callback = info[0].As<Napi::Function>();
    std::string in = info[1].ToString().Utf8Value();
    std::string needle = info[2].ToString().Utf8Value();
    Napi::Object optionsObject = info[3].As<Napi::Object>();

    CMOptions cmOpts = {};
    cmOpts.MatchRepeating = optionsObject.Get("matchRepeating").ToBoolean();
    cmOpts.StartIndex = optionsObject.Get("startIndex").ToNumber().Uint32Value();
    cmOpts.StartFromEnd = optionsObject.Get("startFromEnd").ToBoolean();
    cmOpts.TimeoutNs = optionsObject.Get("timeoutNs").ToNumber().Uint32Value();
    cmOpts.MatchOnWordBoundary = optionsObject.Get("matchOnWordBoundary").ToBoolean();

    auto posPointer = optionsObject.Get("needlePosPointers");
    if (!posPointer.IsNull()) {
        Napi::External<CMStringPosPointers> external = posPointer.As<Napi::External<CMStringPosPointers>>();
        CMStringPosPointers *stringPosPointer = external.Data();
        cmOpts.ContainsPosPointers = stringPosPointer;
    }

    ConfusableMatcherIndexOfDebugFailuresAsyncWorker *worker =
        new ConfusableMatcherIndexOfDebugFailuresAsyncWorker(callback, this->_instance, in, needle, cmOpts);
    worker->Queue();
    return env.Undefined();
};

Napi::Function ConfusableMatcherNapiInterop::GetClass(Napi::Env env) {
    return DefineClass(
        env, "ConfusableMatcher",
        {
            ConfusableMatcherNapiInterop::InstanceMethod(
                "getKeyMappings", &ConfusableMatcherNapiInterop::getKeyMappings),
            ConfusableMatcherNapiInterop::InstanceMethod(
                "computeStringPosPointers", &ConfusableMatcherNapiInterop::computeStringPosPointers),
            ConfusableMatcherNapiInterop::InstanceMethod(
                "freeStringPosPointers", &ConfusableMatcherNapiInterop::freeStringPosPointers),
            ConfusableMatcherNapiInterop::InstanceMethod("indexOf", &ConfusableMatcherNapiInterop::indexOf),
            ConfusableMatcherNapiInterop::InstanceMethod("indexOfAsync", &ConfusableMatcherNapiInterop::indexOfAsync),
            ConfusableMatcherNapiInterop::InstanceMethod(
                "indexOfDebugFailures", &ConfusableMatcherNapiInterop::indexOfDebugFailures),
            ConfusableMatcherNapiInterop::InstanceMethod(
                "indexOfDebugFailuresAsync", &ConfusableMatcherNapiInterop::indexOfDebugFailuresAsync),
        });
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "ConfusableMatcher"), ConfusableMatcherNapiInterop::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
