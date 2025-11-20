package com.rep.finance.repository;

import com.rep.finance.model.BudgetEntity;
import com.rep.finance.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    Optional<BudgetEntity> findByUser(UserEntity user);

    BudgetEntity findByUser_Id(String userId); // <-- **Changed Long to String**
}