#include "interop.h"
#include "ConfusableMatcher/ConfusableMatcher.h"

ConfusableMatcherNapiInterop::ConfusableMatcherNapiInterop(const Napi::CallbackInfo &info) : ObjectWrap(info)
{
    Napi::Env env = info.Env();

    /**
     * Mappings
     */
    std::vector<std::pair<std::string, std::string>> mapVector;
    Napi::Array mapArray = info[0].As<Napi::Array>();
    for (uint32_t x = 0; x < mapArray.Length(); x++)
    {
        Napi::Array result = mapArray.Get(x).As<Napi::Array>();
        std::pair<std::string, std::string> kvPair = {
            result.Get((uint32_t)0).As<Napi::String>().Utf8Value(),
            result.Get((uint32_t)1).As<Napi::String>().Utf8Value()};
        mapVector.push_back(kvPair);
    }

    /**
     * Skips
     */
    std::unordered_set<std::string> skipsSet;
    Napi::Array skipsArray = info[1].As<Napi::Array>();
    for (uint32_t x = 0; x < skipsArray.Length(); x++)
    {
        skipsSet.insert(skipsArray.Get(x).As<Napi::String>().Utf8Value());
    }

    /**
     *
     */
    bool addDefaults = info[2].As<Napi::Boolean>().ToBoolean();

    try
    {
        this->_instance = new ConfusableMatcher(mapVector, skipsSet, addDefaults);
    }
    catch (const std::runtime_error &error)
    {
        throw Napi::Error::New(env, error.what());
    }
}

ConfusableMatcherNapiInterop::~ConfusableMatcherNapiInterop()
{
    delete this->_instance;
}

Napi::Value ConfusableMatcherNapiInterop::getKeyMappings(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::String Key = info[0].As<Napi::String>();

    StackVector<CMString> mappings;
    this->_instance->GetKeyMappings(Key.Utf8Value(), mappings);

    size_t size = mappings.Size();
    Napi::Array result = Napi::Array::New(env, size);
    for (size_t x = 0; x < size; x++)
    {
        auto item = mappings.IsStack ? mappings.Stack[x] : mappings.Heap[x];
        result[x] = Napi::String::New(env, item.Str);
    }

    return result;
}

Napi::Value ConfusableMatcherNapiInterop::indexOf(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::string in = info[0].As<Napi::String>().Utf8Value();
    std::string needle = info[1].As<Napi::String>().Utf8Value();
    Napi::Object optionsObject = info[2].As<Napi::Object>();

    CMOptions cmOpts = {
        .MatchRepeating = optionsObject.Get("matchRepeating").As<Napi::Boolean>().ToBoolean(),
        .StartIndex = optionsObject.Get("startIndex").As<Napi::Number>().ToNumber().Uint32Value(),
        .StartFromEnd = optionsObject.Get("startFromEnd").As<Napi::Boolean>().ToBoolean(),
        .StatePushLimit = optionsObject.Get("statePushLimit").As<Napi::Number>().ToNumber().Uint32Value(),
        .MatchOnWordBoundary = optionsObject.Get("matchOnWordBoundary").As<Napi::Boolean>().ToBoolean()};

    CMReturn result = this->_instance->IndexOf(in, needle, cmOpts);

    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "size"), Napi::Number::New(env, result.Size));
    obj.Set(Napi::String::New(env, "start"), Napi::Number::New(env, result.Start));
    obj.Set(Napi::String::New(env, "status"), Napi::Number::New(env, result.Status));

    return obj;
}

Napi::Function ConfusableMatcherNapiInterop::GetClass(Napi::Env env)
{
    return DefineClass(
        env,
        "ConfusableMatcher",
        {
            ConfusableMatcherNapiInterop::InstanceMethod("getKeyMappings", &ConfusableMatcherNapiInterop::getKeyMappings),
            ConfusableMatcherNapiInterop::InstanceMethod("indexOf", &ConfusableMatcherNapiInterop::indexOf),
        });
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(
        Napi::String::New(env, "ConfusableMatcher"),
        ConfusableMatcherNapiInterop::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
