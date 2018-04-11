/* global document */

import React, { Component } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import HistoryViewerVersionList from './HistoryViewerVersionList';
import Loading from './Loading';
import Preview from 'components/Preview/Preview';
import { versionType } from 'types/versionType';

class HistoryViewerVersionDetail extends Component {
  constructor(props) {
    super(props);

    this.handleLoadingSuccess = this.handleLoadingSuccess.bind(this);

    this.state = {
      loading: true,
    };
  }

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
    document
      .querySelector('.CMSPageHistoryViewerController div:not(.cms-content-tools) .cms-content-header')
      .classList
      .toggle('history-viewer__toolbar--condensed');
  }

  /**
   * When the form builder has finished loading the schema, change the state
   * to remove the loading indicator
   */
  handleLoadingSuccess() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { handleSetCurrentVersion, schemaUrl, version } = this.props;
    const { loading } = this.state;

    return (
      <div className="flexbox-area-grow fill-width">
        <div className="flexbox-area-grow fill-height">
          <div className="panel panel--padded panel--padded-side panel--scrollable">
            <HistoryViewerVersionList
              extraClass="history-viewer__table--current"
              versions={[version]}
              handleSetCurrentVersion={handleSetCurrentVersion}
              isActive
            />

            <div className="history-viewer__version-detail">
              <FormBuilderLoader
                identifier="HistoryViewer.VersionDetail"
                schemaUrl={schemaUrl}
                onLoadingSuccess={this.handleLoadingSuccess}
              />
            </div>
          </div>
        </div>

        <Preview
          className="history-viewer__preview" // removes default: fill-height
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

        { loading ? <Loading /> : null }
      </div>
    );
  }
}

HistoryViewerVersionDetail.propTypes = {
  schemaUrl: React.PropTypes.string.isRequired,
  handleSetCurrentVersion: React.PropTypes.func,
  version: versionType.isRequired,
};

export default HistoryViewerVersionDetail;
