package com.iria.tdam.backend.controller;

import com.iria.tdam.backend.services.MLExportService;
import com.iria.tdam.backend.dto.MlInteractionDto;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLExportController {

    private final MLExportService mlExportService;

    public MLExportController(MLExportService mlExportService) {
        this.mlExportService = mlExportService;
    }

    @GetMapping("/dataset")
    public ResponseEntity<List<MlInteractionDto>> getDataset() {
        return ResponseEntity.ok(mlExportService.getDataset());
    }
}