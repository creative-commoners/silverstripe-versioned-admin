import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import i18n from 'i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { inject } from 'lib/Injector';
import { messageType } from 'types/messageType';
import { versionType } from 'types/versionType';

class HistoryViewerVersionList extends PureComponent {
  /**
   * Return a string of HTML class names for the table element
   *
   * @returns {string}
   */
  getClassNames() {
    const { extraClass } = this.props;
    return classnames({ table: true }, extraClass);
  }

  /**
   * Render any messages into the form
   *
   * @returns {DOMElement}
   */
  renderMessages() {
    const { FormAlertComponent, messages } = this.props;

    if (!messages.length) {
      return null;
    }

    return (
      <div className="history-viewer__messages">
        {
          messages.map((data) => (
            <FormAlertComponent
              key={data.id}
              type={data.type}
              value={data.message}
              closeLabel={i18n._t('HistoryViewerVersionList.CLOSE', 'Close')}
            />
          ))
        }
      </div>
    );
  }

  render() {
    const { HeadingComponent, isActive, VersionComponent, versions } = this.props;

    return (
      <div>
        {this.renderMessages()}

        <table className={this.getClassNames()}>
          <thead>
            <HeadingComponent />
          </thead>
          <tbody>
            {
              versions.map((version) => (
                <VersionComponent
                  key={version.Version}
                  isActive={isActive}
                  version={version}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

HistoryViewerVersionList.propTypes = {
  extraClass: PropTypes.string,
  FormAlertComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  HeadingComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  isActive: PropTypes.bool,
  messages: PropTypes.arrayOf(messageType),
  VersionComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  versions: PropTypes.arrayOf(versionType),
};

HistoryViewerVersionList.defaultProps = {
  extraClass: 'table-hover history-viewer__table',
  isActive: false,
  messages: [],
  versions: [],
};

function mapStateToProps(state) {
  const { messages } = state.versionedAdmin.historyViewer;
  return {
    messages,
  };
}

export { HistoryViewerVersionList as Component };

export default compose(
  connect(mapStateToProps),
  inject(
    ['FormAlert', 'HistoryViewerHeading', 'HistoryViewerVersion'],
    (FormAlert, HistoryViewerHeading, HistoryViewerVersion) => ({
      FormAlertComponent: FormAlert,
      HeadingComponent: HistoryViewerHeading,
      VersionComponent: HistoryViewerVersion,
    }),
    () => 'VersionedAdmin.HistoryViewer.HistoryViewerVersionList'
  )
)(HistoryViewerVersionList);
