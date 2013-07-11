node-debug-hack
===============

Require this module to hack the debug argument.
Allows for launching external processes while debugging

Usage
---

require('node-debug-hack');


Caveat
---
The sub processes will be started with the same debug method as the parent process (--debug/--debug-brk).
If you are using --debug-brk then the subprocess will wait for you to connect prior to continuing.
