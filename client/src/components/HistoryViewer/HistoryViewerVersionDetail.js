/* global document */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { inject } from 'lib/Injector';
import { versionType } from 'types/versionType';

class HistoryViewerVersionDetail extends PureComponent {
  componentWillMount() {
    this.toggleToolbarClass();
  }

  componentWillUnmount() {
    this.toggleToolbarClass();
  }

  /**
   * If the preview panel is enabled, return the component
   *
   * @returns {Preview|null}
   */
  getPreview() {
    const { version, PreviewComponent } = this.props;

    if (!this.isPreviewable()) {
      return null;
    }

    return (
      <PreviewComponent
        className="history-viewer__preview flexbox-area-grow" // removes default: fill-height
        itemLinks={{
          preview: {
            Stage: {
              href: `${version.AbsoluteLink}&archiveDate=${version.LastEdited}`,
              type: 'text/html',
            },
          },
        }}
        itemId={version.Version}
      />
    );
  }

  isPreviewable() {
    const { isPreviewable, compareMode } = this.props;
    return isPreviewable && !compareMode;
  }

  /**
   * Until the CMS is fully React driven, we must control certain aspects of the CMS DOM with
   * manual CSS tweaks. @todo remove this when React drives the CMS.
   */
  toggleToolbarClass() {
    const selector = document
      .querySelector('.CMSPageHistoryViewerController div:not(.cms-content-tools) .cms-content-header');

    if (selector && this.isPreviewable()) {
      selector
        .classList
        .toggle('history-viewer__toolbar--condensed');
    }
  }

  render() {
    const {
      isLatestVersion,
      ListComponent,
      recordId,
      schemaUrl,
      ToolbarComponent,
      CompareWarningComponent,
      version,
      compareMode,
      compareFrom,
      compareTo,
    } = this.props;

    const containerClasses = this.isPreviewable() ? 'panel panel--padded panel--padded-side panel--scrollable' : '';

    const versions = compareMode ? [compareTo, compareFrom] : [version];

    const toolbar = compareMode ? null : (
      <ToolbarComponent
        identifier="HistoryViewer.VersionDetail.Toolbar"
        isLatestVersion={isLatestVersion}
        recordId={recordId}
        versionId={version.Version}
      />
    );

    return (
      <div className="flexbox-area-grow fill-width">
        <div className="flexbox-area-grow fill-height">
          <div className={classnames(containerClasses, 'flexbox-area-grow')}>
            <ListComponent
              extraClass="history-viewer__table--current"
              isActive
              versions={versions}
            />

            <div className="history-viewer__version-detail">
              <FormBuilderLoader
                identifier="HistoryViewer.VersionDetail"
                schemaUrl={schemaUrl}
              />
            </div>
          </div>

          {toolbar}
          <CompareWarningComponent fixed />
        </div>

        {this.getPreview()}
      </div>
    );
  }
}

HistoryViewerVersionDetail.propTypes = {
  isLatestVersion: PropTypes.bool,
  isPreviewable: PropTypes.bool,
  ListComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  PreviewComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  recordId: PropTypes.number.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  ToolbarComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  version: versionType,
  compareMode: PropTypes.bool,
  compareFrom: versionType,
  compareTo: versionType,
};

HistoryViewerVersionDetail.defaultProps = {
  isLatestVersion: false,
  isPreviewable: false,
};

export { HistoryViewerVersionDetail as Component };

export default inject(
  ['HistoryViewerVersionList', 'HistoryViewerToolbar', 'Preview', 'HistoryViewerCompareWarning'],
  (ListComponent, ToolbarComponent, PreviewComponent, CompareWarningComponent) => ({
    ListComponent,
    ToolbarComponent,
    PreviewComponent,
    CompareWarningComponent,
  }),
  ({ version }, context) => `${context}.HistoryViewerVersionDetail.${version.Version}`
)(HistoryViewerVersionDetail);
