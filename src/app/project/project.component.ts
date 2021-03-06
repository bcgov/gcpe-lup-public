import { Component, OnInit, Renderer2, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Project } from 'app/models/project';
import { Survey } from 'app/models/survey';
import { CommentPeriod } from 'app/models/commentperiod';

import { ConfigService } from 'app/services/config.service';
import { ProjectService } from 'app/services/project.service';
import { CommentPeriodService } from 'app/services/commentperiod.service';
import { SurveyService } from 'app/services/survey.service';
import { StorageService } from 'app/services/storage.service';
import { AddCommentComponent } from './comments/add-comment/add-comment.component';
import { AddSurveyResponseComponent } from './comments/add-survey-response/add-survey-response.component';
import { EmailSubscribeComponent } from './email-subscribe/email-subscribe.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly tabLinks = [
    { label: 'Project Details', link: 'project-details' },
    { label: 'Background', link: 'background-info' },
    { label: 'Engagement', link: 'commenting' },
    { label: 'Documents', link: 'documents' },
    { label: 'Project Phase', link: 'project-phase' },
    // { label: 'Participating Indigenous Nations', link: 'pins' }
  ];

  public project: Project = null;
  public period: CommentPeriod = null;
  public appHeader: HTMLHeadingElement;
  private ngbModal: NgbModalRef = null;
  public surveySelected: Survey;


  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private modalService: NgbModal,
    private _changeDetectionRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public configService: ConfigService,
    public projectService: ProjectService, // used in template
    public commentPeriodService: CommentPeriodService, // used in template
    public surveyService: SurveyService
  ) { }

  ngOnInit() {
    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { project: Project }) => {
          if (data.project) {
            this.project = data.project;
            this.storageService.state.currentProject = { type: 'currentProject', data: this.project };
            this.renderer.removeClass(document.body, 'no-scroll');
            this.project = data.project;
            this._changeDetectionRef.detectChanges();
          } else {
            alert('Uh-oh, couldn\'t load project');
            // project not found --> navigate back to project list
            this.router.navigate(['/projects']);
          }
        }
      );
  }

  ngAfterViewInit() {
    this.appHeader = document.getElementsByTagName('h1')[0];
    if ( this.appHeader ) {
      this.appHeader.focus();
    }
  }

  public addComment() {
    if (this.project.commentPeriodForBanner) {
        this.surveyService.getSelectedSurveyByCPId(this.project.commentPeriodForBanner._id)
        .subscribe((loadedSurvey: Survey) => {
          console.log('survey', loadedSurvey)
          if (loadedSurvey) {

          // open modal
          this.ngbModal = this.modalService.open(AddSurveyResponseComponent, { ariaLabelledBy: 'modal-instructions', backdrop: 'static', size: 'xl' as 'lg', keyboard: false });
          // set input parameter
          (<AddSurveyResponseComponent>this.ngbModal.componentInstance).currentPeriod = this.project.commentPeriodForBanner;
          (<AddSurveyResponseComponent>this.ngbModal.componentInstance).project = this.project;
          (<AddSurveyResponseComponent>this.ngbModal.componentInstance).survey = loadedSurvey;

        } else {

          // open modal
          this.ngbModal = this.modalService.open(AddCommentComponent, { ariaLabelledBy: 'modal-instructions', backdrop: 'static', size: 'xl' as 'lg' });
          // set input parameter
          (<AddCommentComponent>this.ngbModal.componentInstance).currentPeriod = this.project.commentPeriodForBanner;
          (<AddCommentComponent>this.ngbModal.componentInstance).project = this.project;
        }
      })

    }
  }

  public addEmail() {
      // open modal
      this.ngbModal = this.modalService.open(EmailSubscribeComponent, { ariaLabelledBy: 'modal-instructions', backdrop: 'static', size: 'xl' as 'lg' });
      // set input parameter
    (<EmailSubscribeComponent>this.ngbModal.componentInstance).project = this.project;
      // check result
      this.ngbModal.result.then(
        value => {
          // saved
          console.log(`Success, value = ${value}`);
        },
        reason => {
          // cancelled
          console.log(`Cancelled, reason = ${reason}`);
        }
      );
  }

  CPActionAriaLabel(projName, action) {
    let projPhrase;
    let actionPhrases = {
      submit: 'Submit a comment to',
      view: 'View more details about'
    }
    projName ? projPhrase = `the ${projName} project` : projPhrase = `this project's`
    return `${actionPhrases[action]} ${projPhrase} comment period.`;
  }

  makeViewDetailsAriaLabel(projName) {
    if (projName) {
      return `View more details about the ${projName} project comment period.`;
    } else {
      return `View more details about this project's comment period.`;
    }
  }

  makeSubmitCommentAriaLabel(projName) {
    if (projName) {
      return `Submit a comment to the ${projName} project comment period.`;
    } else {
      return `Submit a comment this project's comment period.`;
    }
  }

  public projectFieldType(fieldType) {
    return typeof fieldType;
  }


  public goToViewComments() {
    this.router.navigate(['/p', this.project._id, 'cp', this.project.commentPeriodForBanner._id, 'details']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
