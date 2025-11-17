import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Ensure UTC plugin is available in all tests
dayjs.extend(utc);
