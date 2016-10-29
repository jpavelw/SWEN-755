SYSTEM REQUIREMENTS
===============================================================================

Our project was developed using Java Standard Edition. To run this project the
user needs to have at least Java 7 Run Time Environment and Java Development Kit
installed in their machine. The user needs to have access to a console or
terminal to execute the project

HOW TO RUN THE PROJECT
===============================================================================

1. Make sure to have all the files in the same directory

2. Open a terminal windows and navigate to the project location

3. Type "javac *.java". If this step works properly you shall not see any
message

4. Type "rmic MonitoringModule". Ignore the warning if it shows up in the
terminal

5. Type "rmiregistry 5000". Leave this terminal window open

6. Type "java MonitoringModule" in a new terminal window

7. Type "java BloodPump" in a new terminal window

8. Type "java BloodPumpR" in a new terminal window

9. Type "java Oxygenator" in a new terminal window

10. Type "java OxygenatorR" in a new terminal window

HOW THE PROJECT WORKS
===============================================================================

We created separate processes for the blood pump and the oxygenator and for
their backups. The monitoring module class will print a message to let the user
know that it started running. After the first message you shall see a message
saying that the MonitoringModule is receiving the heart beats sent by the
BloodPump and Oxygenator. If any of these components (oxygenator and blood pump)
fails, you shall see a message in the MonitoringModule terminal window saying
that they are not beeping and that it switched to the backup.

Our failure generator generates a random number every time after a heart beat is
sent to the MonitoringModule, if one of those numbers is between a predefined
range it will stop one of those components. The monitoring module will notice
that the component stopped "beating", then it shall print a failure message on
the screen and it will switched to the backup. Both the BloodPump and Oxygenator
make use of the random failure generator, the backups do not make use of this.
However, if you terminate the terminal window of one of the backups and the main
component is down, the MonitoringModule will notice and it shall print a message
in the screen letting the user know that the main component and its backup are
both down.

Both BloodPump and Oxygenator shall print a message in their terminal windows
letting the user know that they are working properly. This message is printed
every time they send a heart beat. They also shall print a message when the
"fail", letting the user know that the component is going down.
