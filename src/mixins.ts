import moment from "moment";

export default {
    methods: {
        formatTime(time: number): string {
			let hour = Math.floor(time / 60);
			let minute = time % 60;
			let period = hour < 12 || hour == 24 ? "AM" : "PM";
			hour = hour % 12 || 12;
			return `${("" + hour).padStart(2, '0')}:${("" + minute).padStart(2, '0')} ${period}`;
        },
        
        formatDate(date: string): string {
            return moment(date, "YYYYMMDD", true).format("M/D/YYYY");
        },

        timestampToDate(timestamp: number): string {
            return moment(timestamp).format("M/D/YYYY");
        }
    }
};
