package com.email.email_writer.controller;

import com.email.email_writer.model.EmailRequest;
import com.email.email_writer.service.EmailReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RequestMapping("/api/email")
@RestController
public class EmailReplyController {


    private final  EmailReplyService emailReplyService;

    public EmailReplyController(EmailReplyService emailReplyService) {
        this.emailReplyService = emailReplyService;
    }


    @PostMapping("/generate")
    public ResponseEntity<String> GenerateReply(@RequestBody EmailRequest emailRequest)
    {
        String response=emailReplyService.generateEmailReply(emailRequest);
         return ResponseEntity.ok(response);
    }
}
