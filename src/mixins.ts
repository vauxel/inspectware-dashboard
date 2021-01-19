import { Component, Vue } from "vue-property-decorator";
import moment from "moment";

@Component
export class FormattingMixin extends Vue {
    formatTime(time: number): string {
        let parts = this.formatTimeParts(time);
        return `${("" + parts.hour).padStart(2, '0')}:${("" + parts.minute).padStart(2, '0')} ${parts.period}`;
    }

    formatTimeParts(time: number): {hour: number, minute: number, period: string} {
        let hour = Math.floor(time / 60);
        let minute = time % 60;
        let period = hour < 12 || hour == 24 ? "AM" : "PM";
        hour = hour % 12 || 12;
        return {
            hour: hour,
            minute: minute,
            period: period
        };
    }

    unformatTime(time: string): number {
        let parts = time.match(/^(\d{1,2}):(\d{2}) ((AM)|(PM))$/);
        if (parts) {
            return (parseInt(parts[1]) * 60) + parseInt(parts[2]) + (parts[3] === "PM" && parts[1] !== "12" ? (12 * 60) : 0);
        } else {
            return -1;
        }
    }

    unformatTimeParts(time: {hour: number, minute: number, period: string}): number {
        return (time.hour * 60) + time.minute + (time.period === "PM" && time.hour !== 12 ? (12 * 60) : 0);
    }
    
    formatDate(date: string): string {
        return moment(date, "YYYYMMDD", true).format("M/D/YYYY");
    }

    unformatDate(date: string): string {
        return moment(date).format("YYYYMMDD");
    }

    timestampToDate(timestamp: number): string {
        return moment(timestamp).format("M/D/YYYY");
    }

    formatPhoneNumber(raw: string): string {
        let cleaned = ("" + raw).replace(/\D/g, "");
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        } else {
            return "";
        }
    }
}
