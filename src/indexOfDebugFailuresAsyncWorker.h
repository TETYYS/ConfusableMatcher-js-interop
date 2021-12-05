#pragma once

#include "ConfusableMatcher/ConfusableMatcher.h"
#include <napi.h>

class ConfusableMatcherIndexOfDebugFailuresAsyncWorker : public Napi::AsyncWorker {
  public:
    ConfusableMatcherIndexOfDebugFailuresAsyncWorker(
        Napi::Function &callback, ConfusableMatcher *cm, std::string in, std::string needle, CMOptions opts);
    virtual ~ConfusableMatcherIndexOfDebugFailuresAsyncWorker(){};

    void Execute() override;
    void OnOK() override;

    CMReturn result;
    std::vector<CMDebugFailure> failures;

  private:
    ConfusableMatcher *_cm;
    std::string _in;
    std::string _needle;
    CMOptions _opts;
};
