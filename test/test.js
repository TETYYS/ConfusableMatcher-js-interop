var assert = require('assert');
var ConfusableMatcher = require('../index');

let getDefaultMap = function()
{
	var map = [
		[ "N", "/[()[]]/" ],
		[ "N", "\u{000f1}" ],
		[ "N", "|\\|" ],
		[ "N", "\u{00245}\u{0002f}" ],
		[ "N", "/IJ" ],
		[ "N", "/|/" ]
	];

	var ns = [ "\u{004c5}", "\u{003a0}", "\u{00418}", "\u{1d427}", "\u{1d45b}", "\u{1d48f}", "\u{1d4c3}", "\u{1d4f7}", "\u{1d52b}", "\u{1d55f}", "\u{1d593}", "\u{1d5c7}", "\u{1d5fb}", "\u{1d62f}", "\u{1d663}", "\u{1d697}", "\u{00578}", "\u{0057c}", "\u{0ff2e}", "\u{02115}", "\u{1d40d}", "\u{1d441}", "\u{1d475}", "\u{1d4a9}", "\u{1d4dd}", "\u{1d511}", "\u{1d579}", "\u{1d5ad}", "\u{1d5e1}", "\u{1d615}", "\u{1d649}", "\u{1d67d}", "\u{0039d}", "\u{1d6b4}", "\u{1d6ee}", "\u{1d728}", "\u{1d762}", "\u{1d79c}", "\u{0a4e0}", "\u{00143}", "\u{00145}", "\u{00147}", "\u{0014b}", "\u{0019d}", "\u{001f8}", "\u{00220}", "\u{0039d}", "\u{01e44}", "\u{01e46}", "\u{01e48}", "\u{01e4a}", "\u{020a6}", "\u{01f20}", "\u{01f21}", "\u{01f22}", "\u{01f23}", "\u{01f24}", "\u{01f25}", "\u{01f26}", "\u{01f27}", "\u{01f74}", "\u{01f75}", "\u{01f90}", "\u{01f91}", "\u{01f92}", "\u{01f93}", "\u{01f94}", "\u{01f95}", "\u{01f96}", "\u{01f97}", "\u{01fc2}", "\u{01fc3}", "\u{01fc4}", "\u{01fc6}", "\u{01fc7}", "\u{000f1}", "\u{00144}", "\u{00146}", "\u{00148}", "\u{00149}", "\u{0014a}", "\u{0019e}", "\u{001f9}", "\u{00235}", "\u{00272}", "\u{00273}", "\u{00274}", "\u{01d70}", "\u{01d87}", "\u{01e45}", "\u{01e47}", "\u{01e49}", "\u{01e4b}" ];
	var is = [ "\u{01ec8}", "\u{00079}", "\u{00069}", "\u{00031}", "\u{0007c}", "\u{0006c}", "\u{0006a}", "\u{00021}", "\u{0002f}", "\u{0005c}\u{0005c}", "\u{0ff49}", "\u{000a1}", "\u{02170}", "\u{02139}", "\u{02148}", "\u{1d422}", "\u{1d456}", "\u{1d48a}", "\u{1d4be}", "\u{1d4f2}", "\u{1d526}", "\u{1d55a}", "\u{1d58e}", "\u{1d5c2}", "\u{1d5f6}", "\u{1d62a}", "\u{1d65e}", "\u{1d692}", "\u{00131}", "\u{1d6a4}", "\u{0026a}", "\u{00269}", "\u{003b9}", "\u{01fbe}", "\u{0037a}", "\u{1d6ca}", "\u{1d704}", "\u{1d73e}", "\u{1d778}", "\u{1d7b2}", "\u{00456}", "\u{024be}", "\u{0a647}", "\u{004cf}", "\u{0ab75}", "\u{013a5}", "\u{00263}", "\u{01d8c}", "\u{0ff59}", "\u{1d432}", "\u{1d466}", "\u{1d49a}", "\u{1d4ce}", "\u{1d502}", "\u{1d536}", "\u{1d56a}", "\u{1d59e}", "\u{1d5d2}", "\u{1d606}", "\u{1d63a}", "\u{1d66e}", "\u{1d6a2}", "\u{0028f}", "\u{01eff}", "\u{0ab5a}", "\u{003b3}", "\u{0213d}", "\u{1d6c4}", "\u{1d6fe}", "\u{1d738}", "\u{1d772}", "\u{1d7ac}", "\u{00443}", "\u{004af}", "\u{010e7}", "\u{0ff39}", "\u{1d418}", "\u{1d44c}", "\u{1d480}", "\u{1d4b4}", "\u{1d4e8}", "\u{1d51c}", "\u{1d550}", "\u{1d584}", "\u{1d5b8}", "\u{1d5ec}", "\u{1d620}", "\u{1d654}", "\u{1d688}", "\u{003a5}", "\u{003d2}", "\u{1d6bc}", "\u{1d6f6}", "\u{1d730}", "\u{1d76a}", "\u{1d7a4}", "\u{02ca8}", "\u{00423}", "\u{004ae}", "\u{013a9}", "\u{013bd}", "\u{0a4ec}", "\u{00176}", "\u{00178}", "\u{001b3}", "\u{00232}", "\u{0024e}", "\u{0028f}", "\u{01e8e}", "\u{01ef2}", "\u{01ef4}", "\u{01ef6}", "\u{01ef8}", "\u{0ff39}", "\u{000cc}", "\u{000cd}", "\u{000ce}", "\u{000cf}", "\u{00128}", "\u{0012a}", "\u{0012c}", "\u{0012e}", "\u{00130}", "\u{00196}", "\u{00197}", "\u{001cf}", "\u{00208}", "\u{0020a}", "\u{0026a}", "\u{0038a}", "\u{00390}", "\u{00399}", "\u{003aa}", "\u{00406}", "\u{0040d}", "\u{00418}", "\u{00419}", "\u{004e2}", "\u{004e4}", "\u{01e2c}", "\u{01e2e}", "\u{01ec8}", "\u{01eca}", "\u{01fd8}", "\u{01fd9}", "\u{02160}", "\u{0ff29}", "\u{030a7}", "\u{030a8}", "\u{0ff6a}", "\u{0ff74}", "\u{000ec}", "\u{000ed}", "\u{000ee}", "\u{000ef}", "\u{00129}", "\u{0012b}", "\u{0012d}", "\u{0012f}", "\u{00131}", "\u{001d0}", "\u{00209}", "\u{0020b}", "\u{00268}", "\u{00269}", "\u{00365}", "\u{003af}", "\u{003ca}", "\u{00438}", "\u{00439}", "\u{00456}", "\u{0045d}", "\u{004e3}", "\u{004e5}", "\u{01e2d}", "\u{01e2f}", "\u{01ec9}", "\u{01ecb}", "\u{01f30}", "\u{01f31}", "\u{01f32}", "\u{01f33}", "\u{01f34}", "\u{01f35}", "\u{01f36}", "\u{01f37}", "\u{01f76}", "\u{01f77}", "\u{01fbe}", "\u{01fd0}", "\u{01fd1}", "\u{01fd2}", "\u{01fd3}", "\u{01fd6}", "\u{01fd7}", "\u{0ff49}", "\u{01d85}", "\u{01e37}", "\u{01e39}", "\u{01e3b}", "\u{01e3d}", "\u{000fd}", "\u{000ff}", "\u{00177}", "\u{001b4}", "\u{00233}", "\u{0024f}", "\u{0028e}", "\u{002b8}", "\u{01e8f}", "\u{01e99}", "\u{01ef3}", "\u{01ef5}", "\u{01ef7}", "\u{01ef9}", "\u{0ff59}" ];
	var gs = [ "\u{0006b}", "\u{00067}", "\u{00071}", "\u{00034}", "\u{00036}", "\u{00039}", "\u{0011f}", "\u{00d6b}", "\u{0ff47}", "\u{0210a}", "\u{1d420}", "\u{1d454}", "\u{1d488}", "\u{1d4f0}", "\u{1d524}", "\u{1d558}", "\u{1d58c}", "\u{1d5c0}", "\u{1d5f4}", "\u{1d628}", "\u{1d65c}", "\u{1d690}", "\u{00261}", "\u{01d83}", "\u{0018d}", "\u{00581}", "\u{1d406}", "\u{1d43a}", "\u{1d46e}", "\u{1d4a2}", "\u{1d4d6}", "\u{1d50a}", "\u{1d53e}", "\u{1d572}", "\u{1d5a6}", "\u{1d5da}", "\u{04e48}", "\u{1d60e}", "\u{1d642}", "\u{1d676}", "\u{0050c}", "\u{013c0}", "\u{013f3}", "\u{0a4d6}", "\u{0011c}", "\u{0011e}", "\u{00120}", "\u{00122}", "\u{00193}", "\u{001e4}", "\u{001e6}", "\u{001f4}", "\u{0029b}", "\u{00393}", "\u{00413}", "\u{01e20}", "\u{0ff27}", "\u{013b6}", "\u{0011d}", "\u{0011f}", "\u{00121}", "\u{00123}", "\u{001e5}", "\u{001e7}", "\u{001f5}", "\u{00260}", "\u{00261}", "\u{00262}", "\u{00040}" ];
	var es = [ "\u{01ec0}", "\u{003a3}", "\u{0039e}", "\u{00065}", "\u{00033}", "\u{00075}", "\u{0212e}", "\u{0ff45}", "\u{0212f}", "\u{02147}", "\u{1d41e}", "\u{1d452}", "\u{1d486}", "\u{1d4ee}", "\u{1d522}", "\u{1d556}", "\u{1d58a}", "\u{1d5be}", "\u{1d5f2}", "\u{1d626}", "\u{1d65a}", "\u{1d68e}", "\u{0ab32}", "\u{00435}", "\u{004bd}", "\u{022ff}", "\u{0ff25}", "\u{02130}", "\u{1d404}", "\u{1d438}", "\u{1d46c}", "\u{1d4d4}", "\u{1d508}", "\u{1d53c}", "\u{1d570}", "\u{1d5a4}", "\u{1d5d8}", "\u{1d60c}", "\u{1d640}", "\u{1d674}", "\u{00395}", "\u{1d6ac}", "\u{1d6e6}", "\u{1d720}", "\u{1d75a}", "\u{1d794}", "\u{00415}", "\u{02d39}", "\u{013ac}", "\u{0a4f0}", "\u{000c8}", "\u{000c9}", "\u{000ca}", "\u{000cb}", "\u{00112}", "\u{00114}", "\u{00116}", "\u{00118}", "\u{0011a}", "\u{0018e}", "\u{00190}", "\u{00204}", "\u{00206}", "\u{00228}", "\u{00246}", "\u{00388}", "\u{0042d}", "\u{004ec}", "\u{01e14}", "\u{01e16}", "\u{01e18}", "\u{01e1a}", "\u{01e1c}", "\u{01eb8}", "\u{01eba}", "\u{01ebc}", "\u{01ebe}", "\u{01ec0}", "\u{01ec2}", "\u{01ec4}", "\u{01ec6}", "\u{01f18}", "\u{01f19}", "\u{01f1a}", "\u{01f1b}", "\u{01f1c}", "\u{01f1d}", "\u{01fc8}", "\u{01fc9}", "\u{000e8}", "\u{000e9}", "\u{000ea}", "\u{000eb}", "\u{00113}", "\u{00115}", "\u{00117}", "\u{00119}", "\u{0011b}", "\u{0018f}", "\u{00205}", "\u{00207}", "\u{00229}", "\u{00247}", "\u{00258}", "\u{0025b}", "\u{0025c}", "\u{0025d}", "\u{0025e}", "\u{00364}", "\u{003ad}", "\u{003b5}", "\u{00435}", "\u{0044d}", "\u{004ed}", "\u{01e15}", "\u{01e17}", "\u{01e19}", "\u{01e1b}", "\u{01e1d}", "\u{01eb9}", "\u{01ebb}", "\u{01ebd}", "\u{01ebf}", "\u{01ec1}", "\u{01ec3}", "\u{01ec5}", "\u{01ec7}", "\u{01f10}", "\u{01f11}", "\u{01f12}", "\u{01f13}", "\u{01f14}", "\u{01f15}", "\u{01f72}", "\u{01f73}" ];
	var rs = [ "\u{00403}", "\u{0042f}", "\u{00072}", "\u{1d42b}", "\u{1d45f}", "\u{1d493}", "\u{1d4c7}", "\u{1d4fb}", "\u{1d52f}", "\u{1d563}", "\u{1d597}", "\u{1d5cb}", "\u{1d5ff}", "\u{1d633}", "\u{1d667}", "\u{1d69b}", "\u{0ab47}", "\u{0ab48}", "\u{01d26}", "\u{02c85}", "\u{00433}", "\u{0ab81}", "\u{0211b}", "\u{0211c}", "\u{0211d}", "\u{1d411}", "\u{1d445}", "\u{1d479}", "\u{1d4e1}", "\u{1d57d}", "\u{1d5b1}", "\u{1d5e5}", "\u{1d619}", "\u{1d64d}", "\u{1d681}", "\u{001a6}", "\u{013a1}", "\u{013d2}", "\u{104b4}", "\u{01587}", "\u{0a4e3}", "\u{00154}", "\u{00156}", "\u{00158}", "\u{00210}", "\u{00212}", "\u{0024c}", "\u{00280}", "\u{00281}", "\u{01e58}", "\u{01e5a}", "\u{01e5c}", "\u{01e5e}", "\u{02c64}", "\u{0ff32}", "\u{013a1}", "\u{00155}", "\u{00157}", "\u{00159}", "\u{00211}", "\u{00213}", "\u{0024d}", "\u{00279}", "\u{0027a}", "\u{0027b}", "\u{0027c}", "\u{0027d}", "\u{016b1}", "\u{01875}", "\u{01d72}", "\u{01d73}", "\u{01d89}", "\u{01e59}", "\u{01e5b}", "\u{01e5d}", "\u{01e5f}", "\u{0ff52}" ];

	var s = [ ns, is, gs, es, rs ];

	for (let x = 0;x < 5;x++) {
		for (let i = 0;i < s[x].length;i++) {
			switch (x) {
				case 0:
					map.push([ "N", s[x][i] ]);
					break;
				case 1:
					map.push([ "I", s[x][i] ]);
					break;
				case 2:
					map.push([ "G", s[x][i] ]);
					break;
				case 3:
					map.push([ "E", s[x][i] ]);
					break;
				case 4:
					map.push([ "R", s[x][i] ]);
					break;
			}
		}
	}

	return map;
}

describe('UnitTests', function() {
	it('Test1', function() {
		var map = [
			[ "N", "T" ],
			[ "I", "E" ],
			[ "C", "S" ],
			[ "E", "T" ]
		];

		var matcher = new ConfusableMatcher(map);
		var res = matcher.indexOf("TEST", "NICE", false, 0);
		assert.equal(0, res.index);
		assert.equal(4, res.length);
		matcher.free();
	});

	it('Test2', function() {
		let map = [
			[ "V", "VA" ],
			[ "V", "VO" ]
		];

		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf("VV", "VAVOVAVO", false, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);
		res = matcher.indexOf("VAVOVAVO", "VV", false, 0);
		assert.equal(0, res.index);
		assert(res.length == 3 || res.length == 4);
		res = matcher.indexOf("VAVOVAVO", "VV", false, 4);
		assert.equal(4, res.index);
		assert(res.length == 3 || res.length == 4);
		res = matcher.indexOf("VAVOVAVO", "VV", false, 2);
		assert.equal(2, res.index);
		assert(res.length == 3 || res.length == 4);
		res = matcher.indexOf("VAVOVAVO", "VV", false, 3);
		assert.equal(4, res.index);
		assert(res.length == 3 || res.length == 4);
		matcher.free();
	});

	it('Test3', function() {
		let map = [
			[ "A", "\x02\x03" ],
			[ "B", "\xFA\xFF" ]
		];

		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf("\x02\x03\xFA\xFF", "AB", false, 0);
		assert.equal(0, res.index);
		assert.equal(6, res.length); // Due to conversion to UTF8
		matcher.free();
	});

	it('Test4', function() {
		let map = [
			[ "S", "$" ],
			[ "D", "[)" ]
		];

		let matcher = new ConfusableMatcher(map);
		matcher.setIgnoreList([ "_", " " ]);
		let res = matcher.indexOf("A__ _ $$$[)D", "ASD", true, 0);
		assert.equal(0, res.index);
		assert.equal(11, res.length);
		matcher.free();
	});

	it('Test5', function() {
		let map = [
			[ "N", "/\\/" ],
			[ "N", "/\\" ],
			[ "I", "/" ]
		];

		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf("/\\/CE", "NICE", false, 0);
		assert.equal(0, res.index);
		assert.equal(5, res.length);
		matcher.free();
	});

	it('Test6', function() {
		let map = [
			[ "N", "/\\/" ],
			[ "V", "\\/" ],
			[ "I", "/" ]
		];

		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf("I/\\/AM", "INAN", true, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);
		res = matcher.indexOf("I/\\/AM", "INAM", true, 0);
		assert.equal(0, res.index);
		assert.equal(6, res.length);
		res = matcher.indexOf("I/\\/AM", "IIVAM", true, 0);
		assert.equal(0, res.index);
		assert.equal(6, res.length);
		matcher.free();
	});

	it('Test7', function() {
		var map = getDefaultMap();

		var inp = "AAAAAAAAASSAFSAFNFNFNISFNSIFSIFJSDFUDSHF ASUF/|/__/|/___%/|/%I%%/|//|/%%%%%NNNN/|/NN__/|/N__𝘪G___%____$__G__𝓰𝘦Ѓ";
		var matcher = new ConfusableMatcher(map);
		matcher.setIgnoreList([ "_", "%", "$" ]);
		var res = matcher.indexOf(inp, "NIGGER", true, 0);

		assert(
			(res.index == 64 && res.length == 57) ||
			(res.index == 89 && res.length == 32));
		matcher.free();
	});

	it('LidlNormalizerTests', function() {
		let map = getDefaultMap();

		// Additional test data
		let keys = [
			"A", "A", "A", "A", "B", "U", "U", "O", "O", "A", "A",
			"A", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y",
			"Z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"U", "A", " ", "S", "M", "O", "L", "N", "A", "T", "I", "O", "N", "N", "I", "G", "N", "I", "FREE", "AE"
		];
		let vals = [
			"\u{00105}", "\u{0ab31}", "\u{01d43}", "\u{000e5}", "\u{0249d}", "\u{000fc}", "\u{000dc}", "\u{000f6}", "\u{000d6}", "\u{000e4}", "\u{000c4}", "\u{0249c}", "\u{0249e}", "\u{0249f}", "\u{024a0}", "\u{024a1}", "\u{024a2}", "\u{024a3}", "\u{024a4}", "\u{024a5}", "\u{024a6}", "\u{024a7}", "\u{024a8}", "\u{024a9}", "\u{024aa}", "\u{024ab}", "\u{024ac}", "\u{024ad}", "\u{024ae}", "\u{024af}", "\u{024b0}", "\u{024b1}", "\u{024b2}", "\u{024b3}", "\u{024b4}", "\u{024cf}", "\u{024d0}", "\u{024d1}", "\u{024d2}", "\u{024d3}", "\u{024d4}", "\u{024d5}", "\u{024d6}", "\u{024d7}", "\u{024d8}", "\u{024d9}", "\u{024da}", "\u{024db}", "\u{024dc}", "\u{024dd}", "\u{024de}", "\u{024df}", "\u{024e0}", "\u{024e1}", "\u{024e2}", "\u{024e3}", "\u{024e4}", "\u{024e5}", "\u{024e6}", "\u{024e7}", "\u{024e8}", "\u{024e9}", "\u{024ea}", "\u{1d552}", "\u{1d553}", "\u{1d554}", "\u{1d555}", "\u{1d556}", "\u{1d557}", "\u{1d558}", "\u{1d559}", "\u{1d55a}", "\u{1d55b}", "\u{1d55c}", "\u{1d55d}", "\u{1d55e}", "\u{1d55f}", "\u{1d560}", "\u{1d561}", "\u{1d562}", "\u{1d563}", "\u{1d564}", "\u{1d565}", "\u{1d566}", "\u{1d567}", "\u{1d568}", "\u{1d569}", "\u{1d56a}", "\u{1d56b}", "\u{1f130}", "\u{1f131}", "\u{1f132}", "\u{1f133}", "\u{1f134}", "\u{1f135}", "\u{1f136}", "\u{1f137}", "\u{1f138}", "\u{1f139}", "\u{1f13a}", "\u{1f13b}", "\u{1f13c}", "\u{1f13d}", "\u{1f13e}", "\u{1f13f}", "\u{1f140}", "\u{1f141}", "\u{1f142}", "\u{1f143}", "\u{1f144}", "\u{1f145}", "\u{1f146}", "\u{1f147}", "\u{1f148}", "\u{1f149}", "\u{020b3}", "\u{00e3f}", "\u{020b5}", "\u{00110}", "\u{00246}", "\u{020a3}", "\u{020b2}", "\u{02c67}", "\u{00142}", "\u{0004a}", "\u{020ad}", "\u{02c60}", "\u{020a5}", "\u{020a6}", "\u{000d8}", "\u{020b1}", "\u{00051}", "\u{02c64}", "\u{020b4}", "\u{020ae}", "\u{00244}", "\u{00056}", "\u{020a9}", "\u{004fe}", "\u{0024e}", "\u{02c6b}", "\u{1d586}", "\u{1d587}", "\u{1d588}", "\u{1d589}", "\u{1d58a}", "\u{1d58b}", "\u{1d58c}", "\u{1d58d}", "\u{1d58e}", "\u{1d58f}", "\u{1d590}", "\u{1d591}", "\u{1d592}", "\u{1d593}", "\u{1d594}", "\u{1d595}", "\u{1d596}", "\u{1d597}", "\u{1d598}", "\u{1d599}", "\u{1d59a}", "\u{1d59b}", "\u{1d59c}", "\u{1d59d}", "\u{1d59e}", "\u{1d59f}", "\u{1f170}", "\u{1f171}", "\u{1f172}", "\u{1f173}", "\u{1f174}", "\u{1f175}", "\u{1f176}", "\u{1f177}", "\u{1f178}", "\u{1f179}", "\u{1f17a}", "\u{1f17b}", "\u{1f17c}", "\u{1f17d}", "\u{1f17e}", "\u{1f17f}", "\u{1f180}", "\u{1f181}", "\u{1f182}", "\u{1f183}", "\u{1f184}", "\u{1f185}", "\u{1f186}", "\u{1f187}", "\u{1f188}", "\u{1f189}", "\u{1f1fa}", "\u{1f1e6}", " ", "\u{002e2}", "\u{01d50}", "\u{01d52}", "\u{002e1}", "\u{0207f}", "\u{01d43}", "\u{01d57}", "\u{01da6}", "\u{01d52}", "\u{0207f}", "\u{0041d}", "\u{00438}", "\u{00433}", "\u{1F1F3}", "\u{1F1EE}", "\u{1f193}", "\u{01d2d}"
		];

		for (let x = 0;x < keys.length;x++)
			map.push([ keys[x], vals[x] ]);

		let matcher = new ConfusableMatcher(map);

		let data = [
			[ [ "\u{00105}", "A" ], [ 0, 2 ] ],
			[ [ "\u{0ab31}", "A" ], [ 0, 3 ] ],
			[ [ "\u{01d43}", "A" ], [ 0, 3 ] ],
			[ [ "abc \u{000e5} def", "ABC A DEF" ], [ 0, 10 ] ],
			[ [ "\u{002e2}\u{01d50}\u{01d52}\u{002e1} \u{0207f}\u{01d43}\u{01d57}\u{01da6}\u{01d52}\u{0207f}", "SMOL NATION" ], [ 0, 29 ] ],
			[ [ "\u{0041d}\u{00438}\u{00433}", "NIG" ], [ 0, 6 ] ],
			[ [ "\u{1f1fa}\u{1f1e6}XD", "UAXD" ], [ 0, 10 ] ],
			[ [ "\u{1f193} ICE", "FREE ICE" ], [ 0, 8 ] ],
			[ [ "chocolate \u{1F1F3}\u{1F1EE}b", "CHOCOLATE NIB" ], [ 0, 19 ] ],
			[ [ "\u{1f171}lueberry", "BLUEBERRY" ], [ 0, 12 ] ],
			[ [ "\u{0249d}", "B" ], [ 0, 3 ] ],
			[ [ "\u{000fc} \u{000dc} \u{000f6} \u{000d6} \u{000e4} \u{000c4}", "U U O O A A" ], [ 0, 17 ] ],
			[ [ "\u{01d2d}", "AE" ], [ 0, 3 ] ],
			[ [ "\u{0249c} \u{0249d} \u{0249e} \u{0249f} \u{024a0} \u{024a1} \u{024a2} \u{024a3} \u{024a4} \u{024a5} \u{024a6} \u{024a7} \u{024a8} \u{024a9} \u{024aa} \u{024ab} \u{024ac} \u{024ad} \u{024ae} \u{024af} \u{024b0} \u{024b1} \u{024b2} \u{024b3} \u{024b4}", "A B C D E F G H I J K L M N O P Q R S T U V W X Y" ], [ 0, 99 ] ],
			[ [ "\u{024cf}\u{024d0}\u{024d1}\u{024d2}\u{024d3}\u{024d4}\u{024d5}\u{024d6}\u{024d7}\u{024d8}\u{024d9}\u{024da}\u{024db}\u{024dc}\u{024dd}\u{024de}\u{024df}\u{024e0}\u{024e1}\u{024e2}\u{024e3}\u{024e4}\u{024e5}\u{024e6}\u{024e7}\u{024e8}\u{024e9}\u{024ea}", "ZABCDEFGHIJKLMNOPQRSTUVWXYZ0" ], [ 0, 84 ] ],
			[ [ "\u{1d552}\u{1d553}\u{1d554}\u{1d555}\u{1d556}\u{1d557}\u{1d558}\u{1d559}\u{1d55a}\u{1d55b}\u{1d55c}\u{1d55d}\u{1d55e}\u{1d55f}\u{1d560}\u{1d561}\u{1d562}\u{1d563}\u{1d564}\u{1d565}\u{1d566}\u{1d567}\u{1d568}\u{1d569}\u{1d56a}\u{1d56b}", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ], [ 0, 104 ] ],
			[ [ "\u{1f130}\u{1f131}\u{1f132}\u{1f133}\u{1f134}\u{1f135}\u{1f136}\u{1f137}\u{1f138}\u{1f139}\u{1f13a}\u{1f13b}\u{1f13c}\u{1f13d}\u{1f13e}\u{1f13f}\u{1f140}\u{1f141}\u{1f142}\u{1f143}\u{1f144}\u{1f145}\u{1f146}\u{1f147}\u{1f148}\u{1f149}", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ], [ 0, 104 ] ],
			[ [ "\u{020b3}\u{00e3f}\u{020b5}\u{00110}\u{00246}\u{020a3}\u{020b2}\u{02c67}\u{00142}J\u{020ad}\u{02c60}\u{020a5}\u{020a6}\u{000d8}\u{020b1}Q\u{02c64}\u{020b4}\u{020ae}\u{00244}V\u{020a9}\u{004fe}\u{0024e}\u{02c6b}", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ], [ 0, 65 ] ],
			[ [ "\u{1d586}\u{1d587}\u{1d588}\u{1d589}\u{1d58a}\u{1d58b}\u{1d58c}\u{1d58d}\u{1d58e}\u{1d58f}\u{1d590}\u{1d591}\u{1d592}\u{1d593}\u{1d594}\u{1d595}\u{1d596}\u{1d597}\u{1d598}\u{1d599}\u{1d59a}\u{1d59b}\u{1d59c}\u{1d59d}\u{1d59e}\u{1d59f}", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ], [ 0, 104 ] ],
			[ [ "\u{1f170}\u{1f171}\u{1f172}\u{1f173}\u{1f174}\u{1f175}\u{1f176}\u{1f177}\u{1f178}\u{1f179}\u{1f17a}\u{1f17b}\u{1f17c}\u{1f17d}\u{1f17e}\u{1f17f}\u{1f180}\u{1f181}\u{1f182}\u{1f183}\u{1f184}\u{1f185}\u{1f186}\u{1f187}\u{1f188}\u{1f189}", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ], [ 0, 104 ] ]
		];
		
		for (let x = 0;x < data.length;x++) {
			var res = matcher.indexOf(data[x][0][0], data[x][0][1], true, 0);
			assert.equal(res.index, data[x][1][0]);
			assert.equal(res.length, data[x][1][1]);
		}
		matcher.free();
	});

	it('Test8', function() {
		let map = [ ];

		let matcher = new ConfusableMatcher(map);
		matcher.setIgnoreList([ "\u{00332}", "\u{00305}", "[", "]" ]);
		let res = matcher.indexOf(
			"[̲̅a̲̅][̲̅b̲̅][̲̅c̲̅][̲̅d̲̅][̲̅e̲̅][̲̅f̲̅][̲̅g̲̅][̲̅h̲̅][̲̅i̲̅][̲̅j̲̅][̲̅k̲̅][̲̅l̲̅][̲̅m̲̅][̲̅n̲̅][̲̅o̲̅][̲̅p̲̅][̲̅q̲̅][̲̅r̲̅][̲̅s̲̅][̲̅t̲̅][̲̅u̲̅][̲̅v̲̅][̲̅w̲̅][̲̅x̲̅][̲̅y̲̅][̲̅z̲̅][̲̅0̲̅][̲̅1̲̅][̲̅2̲̅][̲̅3̲̅][̲̅4̲̅][̲̅5̲̅][̲̅6̲̅][̲̅7̲̅][̲̅8̲̅][̲̅9̲̅][̲̅0̲̅]",
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890",
			false,
			0);
		assert.equal(5, res.index);
		assert.equal(397, res.length);
		matcher.free();
	});

	it('Test9', function() {
		let map = [
			[ " ", " " ]
		];

		for (let x = 0;x < 1000;x++) {
			let matcher = new ConfusableMatcher(map);

			let res = matcher.indexOf(
				"NOT NICE",
				"VERY NICE",
				false,
				0);
			assert.equal(-1, res.index);
			assert.equal(-1, res.length);

			matcher.addMapping("VERY", "NOT", false);

			res = matcher.indexOf(
				"NOT NICE",
				"VERY NICE",
				false,
				0);
			assert.equal(0, res.index);
			assert.equal(8, res.length);

			matcher.removeMapping("VERY", "NOT");
			matcher.free();
		}
	});

	it('Test10', function() {
		var map = [
			[ "B", "A" ],
			[ "B", "AB" ],
			[ "B", "ABC" ],
			[ "B", "ABCD" ],
			[ "B", "ABCDE" ],
			[ "B", "ABCDEF" ],
			[ "B", "ABCDEFG" ],
			[ "B", "ABCDEFGH" ],
			[ "B", "ABCDEFGHI" ],
			[ "B", "ABCDEFGHIJ" ],
			[ "B", "ABCDEFGHIJK" ],
			[ "B", "ABCDEFGHIJKL" ],
			[ "B", "ABCDEFGHIJKLM" ],
			[ "B", "ABCDEFGHIJKLMN" ],
			[ "B", "ABCDEFGHIJKLMNO" ],
			[ "B", "ABCDEFGHIJKLMNOP" ],
			[ "B", "ABCDEFGHIJKLMNOPQ" ],
			[ "B", "ABCDEFGHIJKLMNOPQR" ],
			[ "B", "ABCDEFGHIJKLMNOPQRS" ]
		];

		let matcher = new ConfusableMatcher(map);

		let res = matcher.indexOf(
			"ABCDEFGHIJKLMNOPQRS",
			"B",
			false,
			0);
		assert.equal(0, res.index);
		assert(res.length >= 0 && res.length == 1);

		matcher.removeMapping("B", "ABCDEFGHIJKLMNOP");
		matcher.addMapping("B", "P", false);
		matcher.addMapping("B", "PQ", false);
		matcher.addMapping("B", "PQR", false);
		matcher.addMapping("B", "PQRS", false);
		matcher.addMapping("B", "PQRST", false);
		matcher.addMapping("B", "PQRSTU", false);
		matcher.addMapping("B", "PQRSTUV", false);
		matcher.addMapping("B", "PQRSTUVW", false);
		matcher.addMapping("B", "PQRSTUVWX", false);
		matcher.addMapping("B", "PQRSTUVWXY", false);
		matcher.addMapping("B", "PQRSTUVWXYZ", false);
		matcher.addMapping("B", "PQRSTUVWXYZ0", false);
		matcher.addMapping("B", "PQRSTUVWXYZ01", false);
		matcher.addMapping("B", "PQRSTUVWXYZ012", false);
		matcher.addMapping("B", "PQRSTUVWXYZ0123", false);
		matcher.addMapping("B", "PQRSTUVWXYZ01234", false);
		matcher.addMapping("B", "PQRSTUVWXYZ012345", false);
		matcher.addMapping("B", "PQRSTUVWXYZ0123456", false);
		matcher.addMapping("B", "PQRSTUVWXYZ01234567", false);
		matcher.addMapping("B", "PQRSTUVWXYZ012345678", false);
		matcher.addMapping("B", "PQRSTUVWXYZ0123456789", false);

		res = matcher.indexOf(
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			"BB",
			false,
			0);
		assert.equal(0, res.index);
		assert.equal(2, res.length);

		res = matcher.indexOf(
			"PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789PQRSTUVWXYZ0123456789",
			"BBBBBBBBBBBBBBBBBBBBBBBBBBB",
			true,
			0);
		assert.equal(0, res.index);
		assert(res.length >= 0 && res.length == 547);
		matcher.free();
	});

	it('Test11', function() {
		let map = [ ];
		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf(":)", "", true, 0);
		assert.equal(0, res.index);
		assert.equal(0, res.length);

		res = matcher.indexOf("", ":)", true, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);
		matcher.free();
	});

	it('Test12', function() {
		let map = [];

		let matcher = new ConfusableMatcher(map);

		matcher.addMapping("A", "A", false);
		matcher.addMapping("A", "A", false);
		matcher.addMapping("A", "A", false);
		matcher.addMapping("A", "A", false);

		let res = matcher.indexOf("ABAAA", "ABAR", true, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);
		matcher.free();
	});

	it('Test13', function() {
		let map = [];
		let matcher = new ConfusableMatcher(map);
		let res = matcher.indexOf("?", "?", true, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);

		for (let x = 0;x < 1000;x++) {
			assert.equal(matcher.removeMapping("?", "?"), false);
			assert.equal(matcher.addMapping("?", "?", false), true);
			assert.equal(matcher.removeMapping("?_", "?_"), false);
			assert.equal(matcher.removeMapping("?", "_"), false);
			assert.equal(matcher.removeMapping("?", "?__"), false);

			assert.equal(matcher.addMapping("?_", "?_", false), true);
			assert.equal(matcher.addMapping("?_", "_", false), true);
			assert.equal(matcher.addMapping("?_", "?___", false), true);
			assert.equal(matcher.removeMapping("?_", "?___"), true);
			assert.equal(matcher.removeMapping("?_", "_"), true);
			assert.equal(matcher.removeMapping("?_", "?_"), true);
			assert.equal(matcher.removeMapping("?", "?"), true);
		}
		matcher.free();
	});

	it('Test14', function() {
		let map = [];
		let matcher = new ConfusableMatcher(map);

		let res = matcher.indexOf("A", "A", false, 0);
		assert.equal(0, res.index);
		assert.equal(1, res.length);

		let matcher2 = new ConfusableMatcher(map, false);
		res = matcher2.indexOf("A", "A", false, 0);
		assert.equal(-1, res.index);
		assert.equal(-1, res.length);
		matcher.free();
	});

	it('Test15', function() {
		var map = [];
		var matcher = new ConfusableMatcher(map);
		assert.equal(matcher.addMapping("", "?", false), false);
		assert.equal(matcher.addMapping("?", "", false), false);
		assert.equal(matcher.addMapping("", "", false), false);
		assert.equal(matcher.addMapping("\x00\x01", "?", false), false);
		assert.equal(matcher.addMapping("?", "\x00", false), false);
		assert.equal(matcher.addMapping("\x01", "?", false), false);
		assert.equal(matcher.addMapping("?", "\x01", false), false);
		assert.equal(matcher.addMapping("\x00", "\x01", false), false);
		assert.equal(matcher.addMapping("\x00", "\x00", false), false);
		assert.equal(matcher.addMapping("\x01", "\x00", false), false);
		assert.equal(matcher.addMapping("\x01", "\x01", false), false);
		assert.equal(matcher.addMapping("\x01\x00", "\x00\x01", false), false);
		assert.equal(matcher.addMapping("A\x00", "\x00A", false), false);
		assert.equal(matcher.addMapping("\x01\x00", "\x00\x01", false), false);
		assert.equal(matcher.addMapping("A\x00", "A\x01", false), true);
		assert.equal(matcher.addMapping("A\x01", "A\x00", false), true);
		assert.equal(matcher.addMapping("A\x00", "A\x00", false), true);
		assert.equal(matcher.addMapping("A\x01", "A\x01", false), true);
		matcher.free();
	});
});