#pragma once

#include <napi.h>
#include "ConfusableMatcher/ConfusableMatcher.h"

class ConfusableMatcherNapiInterop : public Napi::ObjectWrap<ConfusableMatcherNapiInterop>
{
public:
    ConfusableMatcherNapiInterop(const Napi::CallbackInfo &);
    ~ConfusableMatcherNapiInterop();

    Napi::Value AddMapping(const Napi::CallbackInfo &);
    Napi::Value AddSkip(const Napi::CallbackInfo &);
    Napi::Value GetKeyMappings(const Napi::CallbackInfo &);
    Napi::Value IndexOf(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

private:
    ConfusableMatcher *_instance;
};
