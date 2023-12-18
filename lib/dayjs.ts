import dayjs from "dayjs";
import "dayjs/locale/fr";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// dayjs configuration
dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Paris");

export default dayjs;
