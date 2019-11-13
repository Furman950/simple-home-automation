const Day = Object.freeze({ Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU", Friday: "FRI", Saturday: "SAT", Sunday: "SUN" });
const MinuteType = Object.freeze({ everyXMinute: "0", evenMinute: "1", oddMinute: "2" });
const DayType = Object.freeze({ everyday: "0", selectedDays: "1" });
const IntervalType = Object.freeze({ seconds: "0",minute: "1", day: "2" })

export {
    Day,
    MinuteType,
    DayType,
    IntervalType
}