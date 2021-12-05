#include "indexOfDebugFailuresAsyncWorker.h"

ConfusableMatcherIndexOfDebugFailuresAsyncWorker::ConfusableMatcherIndexOfDebugFailuresAsyncWorker(
    Napi::Function &callback, ConfusableMatcher *cm, std::string in, std::string needle, CMOptions opts)
    : Napi::AsyncWorker(callback) {
    this->_cm = cm;
    this->_in = in;
    this->_needle = needle;
    this->_opts = opts;
};

void ConfusableMatcherIndexOfDebugFailuresAsyncWorker::Execute() {
    this->result = this->_cm->IndexOfDebugFailures(this->_in, this->_needle, this->_opts, &this->failures);
};

void ConfusableMatcherIndexOfDebugFailuresAsyncWorker::OnOK() {
    Napi::Env env = Env();

    Napi::Object result = Napi::Object::New(env);
    result.Set(Napi::String::New(env, "size"), Napi::Number::New(env, this->result.Size));
    result.Set(Napi::String::New(env, "start"), Napi::Number::New(env, this->result.Start));
    result.Set(Napi::String::New(env, "status"), Napi::Number::New(env, this->result.Status));

    size_t size = this->failures.size();
    Napi::Object failures = Napi::Array::New(Env());
    for (size_t x = 0; x < size; x++) {
        uint64_t inPos = this->failures[x].InPos;
        uint64_t containsPos = this->failures[x].ContainsPos;
        CM_DEBUG_FAILURE_REASON reason = this->failures[x].Reason;

        Napi::Object failure = Napi::Object::New(Env());
        failure.Set(Napi::String::New(this->Env(), "inPos"), Napi::Number::New(this->Env(), inPos));
        failure.Set(Napi::String::New(this->Env(), "containsPos"), Napi::Number::New(this->Env(), containsPos));
        failure.Set(Napi::String::New(this->Env(), "reason"), Napi::Number::New(this->Env(), reason));

        failures[x] = failure;
    }

    Napi::Object value = Napi::Object::New(Env());
    value.Set(Napi::String::New(this->Env(), "result"), result);
    value.Set(Napi::String::New(this->Env(), "failures"), failures);

    this->Callback().Call({value});
};
