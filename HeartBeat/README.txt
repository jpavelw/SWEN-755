SYSTEM REQUIREMENTS
===============================================================================

Our project was developed using Java Standard Edition. To run this project the
user needs to have at least Java 7 installed in their machine. The user needs
to have access to a console or terminal to execute the project.

HOW TO RUN THE PROJECT
===============================================================================

1. Make sure to have all the files in the same directory

2. Open a terminal windows and navigate to the project location

3. Type "javac CPB.java". If this step works properly you shall not see any
message

4. Type "java CPB" to run the project

HOW THE PROJECT WORKS
===============================================================================

We created two threads for the blood pump and the oxygenator. Both plus the
monitoring module class will print a message to let the user know that they
started running. After the first message you shall not see any other message.
If any of these components (oxygenator and blood pump) fails, you shall see a
message in the terminal saying that they are not beeping.

Our failure generator generates a random number every certain amount of seconds,
if one of those numbers is between a predefined range it will stop one of those
components. The monitoring module will notice that the component stopped
"beating", then will print a failure message on the screen.
