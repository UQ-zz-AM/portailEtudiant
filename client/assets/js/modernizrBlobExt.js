/* Blob test
 * Build: http://modernizr.com/download/#-shiv-cssclasses-addtest-teststyles-prefixes-load
 */
Modernizr.addTest('blobconstructor', function () {try {return !!new Blob();} catch (e) {return false;}}, {aliases: ['blob-constructor']});
