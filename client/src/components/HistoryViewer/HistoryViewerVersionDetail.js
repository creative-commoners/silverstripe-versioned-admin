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
   * Until the CMS is fully React driven, we must control certain aspects of the CMS DOM with
   * manual CSS tweaks. @todo remove this when React drives the CMS.
   */
  toggleToolbarClass() {
    const { isPreviewable } = this.props;

    const selector = document
      .querySelector('.CMSPageHistoryViewerController div:not(.cms-content-tools) .cms-content-header');

    if (selector && isPreviewable) {
      selector
        .classList
        .toggle('history-viewer__toolbar--condensed');
    }
  }

  /**
   * If the preview panel is enabled, return the component
   *
   * @returns {Preview|null}
   */
  renderPreview() {
    // const disableSplitModeAtWidth = 991;

    const { isPreviewable, version, PreviewComponent, previewState } =
      this.props;

    if (!isPreviewable || previewState === 'edit') {
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
        // viewSplittable={cmsMainPanelWidth > disableSplitModeAtWidth}
      />
    );
  }

  renderDetailForm() {
    const {
      isLatestVersion,
      isPreviewable,
      ListComponent,
      recordId,
      schemaUrl,
      ToolbarComponent,
      version,
      previewState
    } = this.props;

    const containerClasses = isPreviewable ? 'panel panel--padded panel--padded-side panel--scrollable' : '';

    // Hide when the preview mode is explicitly enabled
    if (previewState === 'preview' && isPreviewable) {
      return null;
    }

    return (
      <div className="flexbox-area-grow fill-height">
        <div className={classnames(containerClasses, 'flexbox-area-grow')}>
          <ListComponent
            extraClass="history-viewer__table--current"
            isActive
            versions={[version]}
          />

          <div className="history-viewer__version-detail">
            <FormBuilderLoader
              identifier="HistoryViewer.VersionDetail"
              schemaUrl={schemaUrl}
            />
          </div>
        </div>

        <ToolbarComponent
          identifier="HistoryViewer.VersionDetail.Toolbar"
          isLatestVersion={isLatestVersion}
          recordId={recordId}
          versionId={version.Version}
          previewState={previewState}
          isPreviewable={isPreviewable}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="flexbox-area-grow fill-width">
        {this.renderDetailForm()}
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
  version: versionType.isRequired,
  previewState: React.PropTypes.oneOf(['edit', 'preview', 'split']),
};

HistoryViewerVersionDetail.defaultProps = {
  isLatestVersion: false,
  isPreviewable: false,
};

export { HistoryViewerVersionDetail as Component };

export default inject(
  ['HistoryViewerVersionList', 'HistoryViewerToolbar', 'Preview'],
  (ListComponent, ToolbarComponent, PreviewComponent) => ({
    ListComponent,
    ToolbarComponent,
    PreviewComponent
  }),
  ({ version }, context) => `${context}.HistoryViewerVersionDetail.${version.Version}`
)(HistoryViewerVersionDetail);
