#pragma once

#include "ConfusableMatcher/ConfusableMatcher.h"
#include <napi.h>

class ConfusableMatcherNapiInterop : public Napi::ObjectWrap<ConfusableMatcherNapiInterop> {
  public:
    ConfusableMatcherNapiInterop(const Napi::CallbackInfo &);
    ~ConfusableMatcherNapiInterop();

    Napi::Value getKeyMappings(const Napi::CallbackInfo &);
    Napi::Value computeStringPosPointers(const Napi::CallbackInfo &);
    Napi::Value freeStringPosPointers(const Napi::CallbackInfo &);
    Napi::Value indexOf(const Napi::CallbackInfo &);
    Napi::Value indexOfAsync(const Napi::CallbackInfo &);
    Napi::Value indexOfDebugFailures(const Napi::CallbackInfo &);
    Napi::Value indexOfDebugFailuresAsync(const Napi::CallbackInfo &);

    static Napi::Function GetClass(Napi::Env);

  private:
    ConfusableMatcher *_instance;
};
