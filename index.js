"use strict";

var ref = require('ref');
var Struct = require('ref-struct');
var ffi = require('ffi');
var ctypes = require('ctypes');

class ConfusableMatcher {
	
	/**
	 * Initializes new confusable matcher. If this instance is not used any more, `free` method must be called.
	 * @param {string[][]} InputMap Input key to value mapping
	 * @param {bool} AddDefaultValues Whether to add default values or not ([a-z] -> [A-Z], [A-Z] -> [A-Z], [0-9] -> [0-9])
	 */
	constructor(InputMap, AddDefaultValues = true)
	{
		this.PtrSize = ref.types.CString.size;
		this.CMHandle = ref.refType(ref.types.void);
		this.CMListHandle = ref.refType(ref.types.void);
		this.CMKV = Struct({
			'Key': ref.types.CString,
			'Value': ref.types.CString
		});
		this.CMMap = Struct({
			'Kv': ref.refType(ref.types.void),
			'Size': ref.types.uint32
		});
		this.libconfusablematcher = ffi.Library('ConfusableMatcher', {
			'InitConfusableMatcher': [ this.CMHandle, [ this.CMMap, ref.types.bool ] ],
			'FreeConfusableMatcher': [ ref.types.void, [ this.CMHandle ] ],
		
			'ConstructIgnoreList': [ this.CMListHandle, [ ref.refType(ref.types.CString), ref.types.int ] ],
			'FreeIgnoreList': [ ref.types.void, [ this.CMListHandle ] ],
		
			'StringIndexOf': [ ref.types.uint64, [ this.CMHandle, ref.types.CString, ref.types.CString, ref.types.bool, ref.types.int, this.CMListHandle ] ],
		
			'AddMapping': [ ref.types.uint8, [ this.CMHandle, ref.types.CString, ref.types.CString, ref.types.bool ] ],
			'RemoveMapping': [ ref.types.uint8 /* not risking it with bool since C++ returns bools as 1 byte and C as 4 bytes */, [ this.CMHandle, ref.types.CString, ref.types.CString ] ]
		});
		this.toUtf8 = function(In) {
			return Buffer.concat([ Buffer.from(In, "utf-8"), Buffer.from('00', 'hex') ]);
		};
		
		let buffer = new Buffer(this.CMKV.size * InputMap.length);
		let bufferOffset = 0;
		
		for (let x = 0;x < InputMap.length;x++) {
			let cmKV = new Buffer(this.CMKV.size);
			let keyUtf8 = this.toUtf8(InputMap[x][0]);
			ref.writePointer(cmKV, 0, keyUtf8);

			try {
				let valUtf8 = this.toUtf8(InputMap[x][1]);
				ref.writePointer(cmKV, this.PtrSize, valUtf8);

				cmKV.copy(buffer, bufferOffset);
				bufferOffset += this.CMKV.size;
			} catch (ex) {
				debugger;
			}
		}

		let cmMap = new this.CMMap({ Kv: buffer, Size: InputMap.length });
		this.Matcher = this.libconfusablematcher.InitConfusableMatcher(cmMap, AddDefaultValues);
		this.setIgnoreList([ ]);
	}

	/*
	 * Frees confusable matcher. This instance of a class cannot be used after this method is called.
	 */
	free()
	{
		this.libconfusablematcher.FreeConfusableMatcher(this.Matcher);
		this.libconfusablematcher.FreeIgnoreList(this.IgnoreList);
	}

	/**
	 * Sets an array of strings to ignore when performing `indexOf`.
	 * These strings will not consume 'contains' portion of the operation.
	 * @param {string[]} In Array of strings
	 */
	setIgnoreList(In)
	{
		if (this.IgnoreList !== undefined)
			this.libconfusablematcher.FreeIgnoreList(this.IgnoreList);
		
		if (In.length === 0) {
			this.IgnoreList = this.libconfusablematcher.ConstructIgnoreList(ref.NULL, 0);
			return;
		}
		
		let ptrList = new Buffer(this.PtrSize * In.length);

		for (let x = 0;x < In.length;x++) {
			let utf8 = this.toUtf8(In[x]);
			ref.writePointer(ptrList, x * this.PtrSize, utf8);
		}

		this.IgnoreList = this.libconfusablematcher.ConstructIgnoreList(ptrList, In.length);
	}

	/**
	 * Performs an indexOf operation using specified mapping and ignore list
	 * @param {string} In Input string
	 * @param {string} Contains What input string should contain, aka the needle
	 * @param {bool} MatchRepeating Should it match repeating substrings in the mapping (without consuming the 'contains' portion of operation)
	 * @param {int} StartIndex Starting index
	 */
	indexOf(In, Contains, MatchRepeating, StartIndex)
	{
		let inUtf8 = this.toUtf8(In);
		let containsUtf8 = this.toUtf8(Contains);

		let res = new ctypes.UInt64(this.libconfusablematcher.StringIndexOf(this.Matcher, inUtf8, containsUtf8, MatchRepeating, StartIndex, this.IgnoreList));
		let index = ctypes.UInt64.lo(res);
		return { index: index == 4294967295 ? -1 : index, length: ctypes.UInt64.hi(res) };
	}

	/**
	 * Adds a new key to value mapping into existing confusable matcher
	 * @param {string} Key Input key
	 * @param {string} Value Input value
	 * @param {bool} CheckValueDuplicate Check if key and value combination already exists
	 * 
	 * @return {bool} If operation was successful or not
	 */
	addMapping(Key, Value, CheckValueDuplicate = true)
	{
		let keyUtf8 = this.toUtf8(Key);
		let valUtf8 = this.toUtf8(Value);

		switch(this.libconfusablematcher.AddMapping(this.Matcher, keyUtf8, valUtf8, CheckValueDuplicate)) {
			case 0:
				return true;
			default:
				return false;
		}
	}

	/**
	 * Removes an existing key to value mapping from confusable matcher
	 * @param {string} Key Input key
	 * @param {string} Value Input value
	 * 
	 * @return {bool} If operation was successful or not
	 */
	removeMapping(Key, Value)
	{
		let keyUtf8 = this.toUtf8(Key);
		let valUtf8 = this.toUtf8(Value);

		try {
			return this.libconfusablematcher.RemoveMapping(this.Matcher, keyUtf8, valUtf8) == 1;
		} catch (err) {
			debugger;
		}
	}
}

module.exports = ConfusableMatcher;