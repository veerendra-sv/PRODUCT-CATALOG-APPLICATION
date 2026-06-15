package mth.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import mth.models.Orders;
import mth.models.OrderItems;
import java.util.List;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String recipientEmail, Orders order, List<OrderItems> items) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Order Confirmation - Product Catalog Application");

        StringBuilder body = new StringBuilder();
        body.append("Dear Customer,\n\n");
        body.append("Thank you for your order! Your order has been placed successfully. Details are below:\n\n");
        body.append("Order ID: #").append(order.getId()).append("\n");
        
        String dateStr = order.getCreatedAt() != null 
            ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss"))
            : "N/A";
        body.append("Order Date: ").append(dateStr).append("\n");
        body.append("Payment Method: ").append(order.getPaymentMethod() != null ? order.getPaymentMethod() : "COD").append("\n\n");
        body.append("Ordered Products:\n");
        body.append("-------------------------------------------\n");
        for (OrderItems item : items) {
            body.append(item.getProductName())
                .append(" \u00d7 ")
                .append(item.getQuantity())
                .append(" = \u20b9")
                .append(Math.round(item.getSubtotal()))
                .append("\n");
        }
        body.append("-------------------------------------------\n");
        body.append("Grand Total: \u20b9").append(Math.round(order.getTotal())).append("\n\n");
        body.append("We hope you enjoy your purchase. Thank you for shopping with us!\n\n");
        body.append("Best regards,\n");
        body.append("Product Catalog Application Team");

        message.setText(body.toString());
        mailSender.send(message);
    }
}
