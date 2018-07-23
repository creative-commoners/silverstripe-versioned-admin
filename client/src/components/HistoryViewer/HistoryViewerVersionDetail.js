/* global document */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { inject } from 'lib/Injector';
import { versionType } from 'types/versionType';

class HistoryViewerVersionDetail extends PureComponent {
  componentWillMount() {
    this.toggleToolbarClass(true);
  }

  componentWillUnmount() {
    this.toggleToolbarClass(false);
  }

  /**
   * A useful doc block explaining why we construct an array of versions in each case (noting that
   * it previously was hard coded to return an array containing the current version only).
   *
   * @returns {Array}
   */
  getListVersions() {
    const { compare, version } = this.props;
    if (this.isCompareMode()) {
      return [compare.versionTo, compare.versionFrom];
    }
    return [version];
  }

  /*
   * Return whether or not we should be displaying the preview component
   * @return bool
   */
  isPreviewable() {
    const { isPreviewable } = this.props;
    return isPreviewable && !this.isCompareMode();
  }

  /*
   * Return whether or not we should be comparing two versions
   * @return bool
   */
  isCompareMode() {
    const { compare } = this.props;
    return compare && compare.versionFrom && compare.versionTo;
  }

  /**
   * Until the CMS is fully React driven, we must control certain aspects of the CMS DOM with
   * manual CSS tweaks. @todo remove this when React drives the CMS.
   *
   * @param {boolean} add
   */
  toggleToolbarClass(add = true) {
    const selector = document
      .querySelector('.CMSPageHistoryViewerController div:not(.cms-content-tools) .cms-content-header');
    const className = 'history-viewer__toolbar--condensed';

    if (selector && this.isPreviewable()) {
      if (add) {
        selector.classList.add(className);
      } else {
        selector.classList.remove(className);
      }
    }
  }

  /**
   * If the preview panel is enabled, return the component
   *
   * @returns {Preview|null}
   */
  renderPreview() {
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

  /**
   * If the toolbar should be viewable, return the component
   *
   * @returns {HistoryViewerToolbar|null}
   */
  renderToolbar() {
    const { ToolbarComponent, isLatestVersion, recordId, version } = this.props;

    if (this.isCompareMode()) {
      return null;
    }

    return (
      <ToolbarComponent
        identifier="HistoryViewer.VersionDetail.Toolbar"
        isLatestVersion={isLatestVersion}
        recordId={recordId}
        versionId={version.Version}
      />
    );
  }

  render() {
    const { ListComponent, schemaUrl, CompareWarningComponent } = this.props;

    const containerClasses = this.isPreviewable() ? 'panel panel--padded panel--padded-side panel--scrollable' : '';

    return (
      <div className="flexbox-area-grow fill-width">
        <div className="flexbox-area-grow fill-height">
          <div className={classnames(containerClasses, 'flexbox-area-grow')}>
            <ListComponent
              extraClass="history-viewer__table--current"
              isActive
              versions={this.getListVersions()}
            />

            <div className="history-viewer__version-detail">
              <FormBuilderLoader
                identifier="HistoryViewer.VersionDetail"
                schemaUrl={schemaUrl}
              />
            </div>
          </div>

          {this.renderToolbar()}
          <CompareWarningComponent fixed />
        </div>

        {this.renderPreview()}
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
  compare: PropTypes.oneOfType([
    PropTypes.shape({
      versionFrom: versionType,
      versionTo: versionType,
    }),
    PropTypes.bool,
  ]),
};

HistoryViewerVersionDetail.defaultProps = {
  isLatestVersion: false,
  isPreviewable: false,
  compare: false,
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
