import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IDepartment, Department } from 'app/shared/model/department.model';
import { DepartmentService } from './department.service';
import { ICompany } from 'app/shared/model/company.model';
import { CompanyService } from 'app/entities/company/company.service';

@Component({
  selector: 'jhi-department-update',
  templateUrl: './department-update.component.html'
})
export class DepartmentUpdateComponent implements OnInit {
  isSaving = false;
  companies: ICompany[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(200)]],
    type: [],
    description: [null, [Validators.maxLength(1000)]],
    active: [],
    companyId: []
  });

  constructor(
    protected departmentService: DepartmentService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ department }) => {
      this.updateForm(department);

      this.companyService.query().subscribe((res: HttpResponse<ICompany[]>) => (this.companies = res.body || []));
    });
  }

  updateForm(department: IDepartment): void {
    this.editForm.patchValue({
      id: department.id,
      name: department.name,
      type: department.type,
      description: department.description,
      active: department.active,
      companyId: department.companyId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const department = this.createFromForm();
    if (department.id !== undefined) {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    }
  }

  private createFromForm(): IDepartment {
    return {
      ...new Department(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      type: this.editForm.get(['type'])!.value,
      description: this.editForm.get(['description'])!.value,
      active: this.editForm.get(['active'])!.value,
      companyId: this.editForm.get(['companyId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartment>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: ICompany): any {
    return item.id;
  }
}
