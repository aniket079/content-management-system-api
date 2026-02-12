import cron from "node-cron";

export const testing = ()=>{
    console.log("Testing function schedule")
    cron.schedule("21 15 * * *",()=>{
        console.log("running testing");
    })
}