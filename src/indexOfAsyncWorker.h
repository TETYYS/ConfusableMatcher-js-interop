#pragma once

#include <napi.h>
#include "ConfusableMatcher/ConfusableMatcher.h"

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
