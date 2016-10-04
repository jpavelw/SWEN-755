import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.rmi.Naming;

public class MonitoringModule extends UnicastRemoteObject implements MonitorI {

    private boolean[] iAmAlive = new boolean[] {true, true, true, true};
    private boolean canReceive = false;

    public MonitoringModule() throws RemoteException { super(); }

    public void receiveHeartBeat(byte process) throws RemoteException {
        this.canReceive = true;

        if(process == BLOODPUMP_MAIN){
            this.iAmAlive[0] = true;
            System.out.println("### HEARTBEAT RECEIVED BloodPump  ###");
        }

        if(process == BLOOBPUMP_BK){
            this.iAmAlive[1] = true;
            System.out.println("### HEARTBEAT RECEIVED BloodPumpR ###");
        }

    }

    public void checkHeartBeats() throws RemoteException{
        while(true){
            if(canReceive){
                if(this.iAmAlive[0]){
                    System.out.println("### MAIN BLOODPUMP BEATING ###");
                    this.iAmAlive[0] = false;
                } else {
                    System.out.println("### 4 ###");
                    System.out.println("### MAIN BLOODPUMP DOWN, SWITCHING TO BACKUP ###");
                }
                try {
                    Thread.sleep(3000);
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main (String [] args){
        try {
            MonitorI monitoringModule = new MonitoringModule();
            Naming.rebind("rmi://localhost:5000/monitor", monitoringModule);
            monitoringModule.checkHeartBeats();
        } catch(Exception e){
            e.printStackTrace();
        }
    }
}
