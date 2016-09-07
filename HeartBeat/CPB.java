public class CPB{
    public static void main(String [] args){
        FailureHandler failureHandler = new FailureHandler();
        MonitoringModule MonitoringModule = new MonitoringModule();
        Thread bloodPump = new Thread(new BloodPump());
        Thread oxygenator = new Thread(new Oxygenator());
    }
}
