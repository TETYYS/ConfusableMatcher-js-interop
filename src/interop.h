#pragma once

#include <napi.h>
#include "ConfusableMatcher/ConfusableMatcher.h"

class ConfusableMatcherNapiInterop : public Napi::ObjectWrap<ConfusableMatcherNapiInterop>
{
public:
    ConfusableMatcherNapiInterop(const Napi::CallbackInfo &);
    ~ConfusableMatcherNapiInterop();

    Napi::Value getKeyMappings(const Napi::CallbackInfo &);
    Napi::Value indexOf(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

private:
    ConfusableMatcher *_instance;
};
