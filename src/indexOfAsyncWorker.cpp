#include "indexOfAsyncWorker.h"

ConfusableMatcherIndexOfAsyncWorker::ConfusableMatcherIndexOfAsyncWorker(
    Napi::Function &callback, ConfusableMatcher *cm, std::string in, std::string needle, CMOptions opts)
    : Napi::AsyncWorker(callback) {
    this->_cm = cm;
    this->_in = in;
    this->_needle = needle;
    this->_opts = opts;
};

void ConfusableMatcherIndexOfAsyncWorker::Execute() {
    this->result = this->_cm->IndexOf(this->_in, this->_needle, this->_opts);
};

void ConfusableMatcherIndexOfAsyncWorker::OnOK() {
    Napi::Object obj = Napi::Object::New(Env());
    obj.Set(Napi::String::New(this->Env(), "size"), Napi::Number::New(this->Env(), this->result.Size));
    obj.Set(Napi::String::New(this->Env(), "start"), Napi::Number::New(this->Env(), this->result.Start));
    obj.Set(Napi::String::New(this->Env(), "status"), Napi::Number::New(this->Env(), this->result.Status));
    this->Callback().Call({obj});
};
