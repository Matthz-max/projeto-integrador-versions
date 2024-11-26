package com.api.integrador.back.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.integrador.back.dto.CarroDTO;
import com.api.integrador.back.model.Carromodel;
import com.api.integrador.back.repository.CarroRepository;

@RestController
@RequestMapping("carro")  
public class CarroController {

    @Autowired
    private CarroRepository repo; 

    @GetMapping("/listarCarro")
    public ResponseEntity<?> mostrar(){
    	List<Carromodel> lista = repo.findAll();
    	return ResponseEntity.ok(lista);
    }
    // Endpoint para criar o carro
    @PostMapping("/criarCarro")
    public ResponseEntity<Carromodel> criarcarro(@RequestBody CarroDTO carro) {
        Carromodel savedCarro = new Carromodel(carro); 
        repo.save(savedCarro);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCarro);  
    }

    // Endpoint para atualizar o carro
    @PutMapping("/atualizarCarro/{id}")
    public ResponseEntity<Carromodel> atualizarcarro(@PathVariable int id, @RequestBody Carromodel carro) {
        Optional<Carromodel> existingCarro = repo.findById(id);
        
        if (!existingCarro.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }

        carro.setId(id); 
        Carromodel updatedCarro = repo.save(carro);  
        return ResponseEntity.ok(updatedCarro); 
    }

    // Endpoint para excluir o carro
    @DeleteMapping("deleteCarro/{id}")
    public ResponseEntity  <Carromodel> deletarCarro(@PathVariable int id) {
        Optional<Carromodel> existingCarro = repo.findById(id);
        
        if (!existingCarro.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();   
        }	

        repo.deleteById(id);   
        return ResponseEntity.noContent().build();  
    }
}
 
