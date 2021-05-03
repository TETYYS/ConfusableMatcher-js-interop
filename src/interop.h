#pragma once

#include <napi.h>
#include "ConfusableMatcher/ConfusableMatcher.h"

class ConfusableMatcherNapiInterop : public Napi::ObjectWrap<ConfusableMatcherNapiInterop>
{
public:
    ConfusableMatcherNapiInterop(const Napi::CallbackInfo &);
    ~ConfusableMatcherNapiInterop();

    Napi::Value getKeyMappings(const Napi::CallbackInfo &);
    Napi::Value computeStringPosPointers(const Napi::CallbackInfo &);
    Napi::Value freeStringPosPointers(const Napi::CallbackInfo &);
    Napi::Value indexOf(const Napi::CallbackInfo &);
    Napi::Value indexOfAsync(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

private:
    ConfusableMatcher *_instance;
};

class ConfusableMatcherIndexOfAsyncWorker : public Napi::AsyncWorker
{
public:
    ConfusableMatcherIndexOfAsyncWorker(Napi::Function &callback, ConfusableMatcher *cm, std::string in, std::string needle, CMOptions opts);
    virtual ~ConfusableMatcherIndexOfAsyncWorker(){};

    void Execute() override;
    void OnOK() override;

    CMReturn result;

private:
    ConfusableMatcher *_cm;
    std::string _in;
    std::string _needle;
    CMOptions _opts;
};
