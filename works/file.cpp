#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main(int argc, char** argv)
{
	string a1 = argv[1];
/*
	string a2 = argv[2];
	string s1 = "<!DOCTYPE html>\n\
<html>\n\
<head>\n\
	<title>T0" + a1 + "E";
	string s2 = "</title>\n\
	<link rel=\"shortcut icon\" href=\"../favicon.ico\">\n\
	<link rel=\"stylesheet\" href=\"../html/resources/default.css\">\n\
	<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\
</head>\n\
<body>\n\
	<div id=\"webgl-output\">\n\
		<script type=\"module\" src=\"t" + a1 + "_ex";
	string s3 = ".js\"></script>\n\
	</div>\n\
</body>\n\
</html>";
*/
	int n = atoi(argv[2]);
	string s, filename;
	ofstream f;
	for (int i = 0; i < n; i++)
	{
		s = (i < 9 ? "0" : "") + to_string(i + 1);
		filename = "t" + a1 + "_ex" + s + ".html";
		f.open(filename);
/*
		f << s1 << s << s2 << s << s3 << endl;
		f.close();
		f.open(filename);
*/
		f << "<meta http-equiv=\"Refresh\" content=\"0; url=\'https://localhost\\_USER_CODE_HERE\\CG-gh-pages\\works\\T" + a1 + "\\" + filename + "\'\"/>";
		f.close();
	}
	return 0;
}
