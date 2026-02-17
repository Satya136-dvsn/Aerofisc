/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@budgetwise.com}")
    private String fromEmail;

    public EmailService() {
    }

    @Async
    public void sendEmail(String to, String subject, String content) {
        if (mailSender == null) {
            logger.warn("Mail sender is not configured. Skipping email to: {}", to);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML

            mailSender.send(message);
            logger.info("Email sent to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
        }
    }

    public void sendBudgetAlert(String to, String budgetName, String threshold) {
        String subject = "Budget Alert: " + budgetName;
        String content = String.format(
                "<h1>Budget Alert</h1>" +
                        "<p>You have exceeded <b>%s%%</b> of your budget for <b>%s</b>.</p>" +
                        "<p>Please review your spending on BudgetWise.</p>",
                threshold, budgetName);
        sendEmail(to, subject, content);
    }

    public void sendBillReminder(String to, String billName, String dueDate) {
        String subject = "Bill Reminder: " + billName;
        String content = String.format(
                "<h1>Bill Reminder</h1>" +
                        "<p>Your bill for <b>%s</b> is due on <b>%s</b>.</p>" +
                        "<p>Don't forget to pay on time to avoid late fees!</p>",
                billName, dueDate);
        sendEmail(to, subject, content);
    }
}
