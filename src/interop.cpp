#include "interop.h"
#include "ConfusableMatcher/ConfusableMatcher.h"

using namespace Napi;

ConfusableMatcherNapiInterop::ConfusableMatcherNapiInterop(const Napi::CallbackInfo &info) : ObjectWrap(info)
{
    Napi::Array Map = info[0].As<Napi::Array>();
    std::vector<std::pair<std::string, std::string>> InputMap;
    for (uint32_t x = 0; x < Map.Length(); x++)
    {
        std::pair<std::string, std::string> kvPair;
        Napi::Array result = Map.Get(x).As<Napi::Array>();
        kvPair.first = result.Get((uint32_t)0).As<Napi::String>().Utf8Value();
        kvPair.second = result.Get((uint32_t)1).As<Napi::String>().Utf8Value();
        InputMap.push_back(kvPair);
    }

    Napi::Array Ignores = info[1].As<Napi::Array>();
    std::unordered_set<std::string> Skips;
    for (uint32_t x = 0; x < Ignores.Length(); x++)
    {
        std::pair<std::string, std::string> kvPair;
        Napi::String ignore = Map.Get(x).As<Napi::String>();
        Skips.insert(ignore.Utf8Value());
    }

    Napi::Boolean AddDefaultValues = info[2].As<Napi::Boolean>();
    this->_instance = new ConfusableMatcher(InputMap, Skips, AddDefaultValues);
}

ConfusableMatcherNapiInterop::~ConfusableMatcherNapiInterop()
{
    delete this->_instance;
}

Napi::Value ConfusableMatcherNapiInterop::AddMapping(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::String Key = info[0].As<Napi::String>();
    Napi::String Value = info[1].As<Napi::String>();
    Napi::Boolean CheckValueDuplicate = info[2].As<Napi::Boolean>();
    bool result = this->_instance->AddMapping(Key.Utf8Value(), Value.Utf8Value(), CheckValueDuplicate.ToBoolean());
    return Napi::Boolean::New(env, result);
}

Napi::Value ConfusableMatcherNapiInterop::AddSkip(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::String In = info[0].As<Napi::String>();
    bool result = this->_instance->AddSkip(In.Utf8Value());
    return Napi::Boolean::New(env, result);
}

Napi::Value ConfusableMatcherNapiInterop::GetKeyMappings(const Napi::CallbackInfo &info)
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

Napi::Value ConfusableMatcherNapiInterop::IndexOf(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::String In = info[0].As<Napi::String>();
    Napi::String Contains = info[1].As<Napi::String>();

    Napi::Object Options = info[2].As<Napi::Object>();
    Napi::Boolean MatchRepeating = Options.Get("matchRepeating").As<Napi::Boolean>();
    Napi::Number StartIndex = Options.Get("startIndex").As<Napi::Number>();
    Napi::Boolean StartFromEnd = Options.Get("startFromEnd").As<Napi::Boolean>();
    Napi::Number StatePushLimit = Options.Get("statePushLimit").As<Napi::Number>();
    Napi::Boolean MatchOnWordBoundary = Options.Get("matchOnWordBoundary").As<Napi::Boolean>();

    CMOptions opts = {};
    opts.MatchRepeating = MatchRepeating.ToBoolean();
    opts.StartIndex = StartIndex.ToNumber().Int32Value();
    opts.StartFromEnd = StartFromEnd.ToBoolean();
    opts.StatePushLimit = StatePushLimit.ToNumber().Int32Value();
    opts.MatchOnWordBoundary = MatchOnWordBoundary.ToBoolean();

    std::pair<int, int> result = this->_instance->IndexOf(
        In.Utf8Value(),
        Contains.Utf8Value(),
        opts);

    Napi::Object obj = Napi::Object::New(env);
    obj.Set(Napi::String::New(env, "Index"), Napi::Number::New(env, result.first));
    obj.Set(Napi::String::New(env, "Length"), Napi::Number::New(env, result.second));

    return obj;
}

Napi::Function ConfusableMatcherNapiInterop::GetClass(Napi::Env env)
{
    return DefineClass(
        env,
        "ConfusableMatcherNapiInterop",
        {
            ConfusableMatcherNapiInterop::InstanceMethod("AddMapping", &ConfusableMatcherNapiInterop::AddMapping),
            ConfusableMatcherNapiInterop::InstanceMethod("AddSkip", &ConfusableMatcherNapiInterop::AddSkip),
            ConfusableMatcherNapiInterop::InstanceMethod("GetKeyMappings", &ConfusableMatcherNapiInterop::GetKeyMappings),
            ConfusableMatcherNapiInterop::InstanceMethod("IndexOf", &ConfusableMatcherNapiInterop::IndexOf),
        });
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(
        Napi::String::New(env, "ConfusableMatcherNapiInterop"),
        ConfusableMatcherNapiInterop::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
