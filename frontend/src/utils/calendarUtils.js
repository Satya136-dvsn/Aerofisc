/**
 * ICS Calendar Export Utility
 * Generates .ics files for bill due dates
 */

/**
 * Generate a unique ID for ICS events
 * @returns {string} Unique event ID
 */
const generateUID = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@budgetwise`;
};

/**
 * Format a date for ICS format (YYYYMMDD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
const formatICSDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

/**
 * Format a datetime for ICS format (YYYYMMDDTHHMMSS)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted datetime string
 */
const formatICSDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Get recurrence rule for ICS based on bill recurrence type
 * @param {string} recurrence - WEEKLY, MONTHLY, QUARTERLY, YEARLY, ONE_TIME
 * @returns {string|null} ICS RRULE or null for one-time
 */
const getRecurrenceRule = (recurrence) => {
    switch (recurrence) {
        case 'WEEKLY':
            return 'RRULE:FREQ=WEEKLY';
        case 'MONTHLY':
            return 'RRULE:FREQ=MONTHLY';
        case 'QUARTERLY':
            return 'RRULE:FREQ=MONTHLY;INTERVAL=3';
        case 'YEARLY':
            return 'RRULE:FREQ=YEARLY';
        case 'ONE_TIME':
        default:
            return null;
    }
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Create a single ICS event for a bill
 * @param {Object} bill - Bill object
 * @returns {string} ICS event string
 */
const createBillEvent = (bill) => {
    const uid = generateUID();
    const dueDate = bill.nextDueDate || bill.dueDate;
    const dateStr = formatICSDate(dueDate);
    const now = formatICSDateTime(new Date());

    const lines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:💳 Bill Due: ${bill.name}`,
        `DESCRIPTION:Amount: ${formatAmount(bill.amount)}\\nCategory: ${bill.category || 'General'}\\nStatus: ${bill.status || 'PENDING'}${bill.notes ? '\\nNotes: ' + bill.notes : ''}`,
    ];

    // Add recurrence rule for recurring bills
    const rrule = getRecurrenceRule(bill.recurrence);
    if (rrule) {
        lines.push(rrule);
    }

    // Add reminder 1 day before
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-P1D');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Reminder: ${bill.name} is due tomorrow (${formatAmount(bill.amount)})`);
    lines.push('END:VALARM');

    lines.push('END:VEVENT');

    return lines.join('\r\n');
};

/**
 * Generate a complete ICS calendar file for bills
 * @param {Array} bills - Array of bill objects
 * @param {string} calendarName - Name for the calendar
 * @returns {string} Complete ICS file content
 */
export const generateBillsCalendar = (bills, calendarName = 'BudgetWise Bills') => {
    const header = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BudgetWise//Bill Tracker//EN',
        `X-WR-CALNAME:${calendarName}`,
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
    ].join('\r\n');

    const footer = 'END:VCALENDAR';

    const events = bills
        .filter(bill => bill.status !== 'PAID') // Only include unpaid bills
        .map(bill => createBillEvent(bill))
        .join('\r\n');

    return `${header}\r\n${events}\r\n${footer}`;
};

/**
 * Download bills as an ICS calendar file
 * @param {Array} bills - Array of bill objects
 * @param {string} filename - Name for the downloaded file
 */
export const downloadBillsCalendar = (bills, filename = 'budgetwise-bills.ics') => {
    const icsContent = generateBillsCalendar(bills);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Generate a calendar subscription URL (for external calendar apps)
 * This would typically point to a backend endpoint
 * @param {string} userId - User ID for the calendar
 * @returns {string} Calendar subscription URL
 */
export const getCalendarSubscriptionUrl = (userId) => {
    // In production, this would be a backend endpoint that serves the ICS file
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/bills/calendar/${userId}`;
};

export default {
    generateBillsCalendar,
    downloadBillsCalendar,
    getCalendarSubscriptionUrl,
};
