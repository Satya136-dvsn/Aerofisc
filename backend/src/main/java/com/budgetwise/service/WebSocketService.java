/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
   }

    public void sendDashboardUpdate(Long userId) {
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/dashboard", "refresh");
    }

    public void sendBudgetAlert(Long userId, String message) {
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/alerts", message);
    }

    public void sendNotification(Long userId, String notification) {
        messagingTemplate.convertAndSend("/topic/user/" + userId + "/notifications", notification);
    }
}
