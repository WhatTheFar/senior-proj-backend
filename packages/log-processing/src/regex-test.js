const regex = /^(?<full_date>(?<YYYY>[0-9]{4})-(?<MM>1[0-2]|0[1-9])-(?<DD>3[01]|0[1-9]|[12][0-9])) (?<time>(?<hh>2[0-3]|[01][0-9]):(?<mm>[0-5][0-9]):(?<ss>[0-5][0-9])(?:.(?<SSS>[0-9]+))) - (root|netpie) - INFO - (?<topic>\/\S*) -> b'(?<payload>\S*)'$/gm;
const str = `2019-11-26 13:41:31,784 - root - INFO - /seniorproj/people/set -> b'5'
2019-11-26 13:41:24,485 - root - INFO - /seniorproj/people/bg -> b'2019-11-26T06:41:24.443Z'
2019-11-26 13:41:24,485 - netpie - INFO - /seniorproj/people/bg -> b'2019-11-26T06:41:24.443Z'`;
let m;

while ((m = regex.exec(str)) !== null) {
	// This is necessary to avoid infinite loops with zero-width matches
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	// The result can be accessed through the `m`-variable.
	m.forEach((match, groupIndex) => {
		console.log(`Found match, group ${groupIndex}: ${match}`);
	});
	console.log();
}
