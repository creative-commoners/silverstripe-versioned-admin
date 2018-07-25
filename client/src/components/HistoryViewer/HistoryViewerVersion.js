import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { inject } from 'lib/Injector';
import { versionType, defaultVersion } from 'types/versionType';
import { compareType } from 'types/compareType';
import i18n from 'i18n';
import classNames from 'classnames';
import {
  showVersion,
  clearMessages,
  setCompareMode,
  setCompareFrom,
  setCompareTo,
} from 'state/historyviewer/HistoryViewerActions';

class HistoryViewerVersion extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCompare = this.handleCompare.bind(this);
  }

  /**
   * Returns the name of the Member who either published the object or last edited it, depending
   * on whether the object is published or not
   *
   * @returns {string}
   */
  getAuthor() {
    const { version } = this.props;
    let member = {};

    if (version.Published && version.Publisher) {
      member = version.Publisher;
    } else if (version.Author) {
      member = version.Author;
    }

    return `${member.FirstName || ''} ${member.Surname || ''}`;
  }

  /**
   * When clicking on a version, render the detail view for it via a Redux action dispatch
   * passed through via a closure prop (onSelect)
   */
  handleClick() {
    const { onSelect, version, isActive, compare } = this.props;

    // If the clear button is shown, don't do anything when clicking on the row
    if (isActive) {
      return false;
    }

    onSelect(version, compare);
    return false;
  }

  handleCompare() {
    const { enterCompareMode, version } = this.props;
    enterCompareMode(version);
  }

  /**
   * When closing the version, return back to the list view via Redux action dispatch
   */
  handleClose() {
    const { onSelect, version, compare, compare: { versionFrom } } = this.props;
    if (versionFrom && versionFrom.Version === version.Version) {
      delete compare.versionFrom;
    }
    onSelect(0, compare);
  }

  /**
   * Renders a "compare mode" button which will allow the user to start selecting versions to
   * compare differences between. This is usually rendered in the "more actions" menu.
   *
   * @returns {FormAction|null}
   */
  renderCompareButton() {
    const { compare, FormActionComponent } = this.props;
    const translatedText = i18n._t('HistoryViewerVersion.COMPARE', 'Compare');

    if (compare) {
      return null;
    }

    return (
      <FormActionComponent
        onClick={this.handleCompare}
        title={translatedText}
        extraClass="history-viewer__compare-button"
      >
        {translatedText}
      </FormActionComponent>
    );
  }

  /**
   * Renders a "clear" button to close the version, for example when used in a "detail view"
   * context. This is shown when this version is "active", displayed with a blue background.
   *
   * @returns {FormAction|null}
   */
  renderClearButton() {
    const { FormActionComponent, isActive } = this.props;

    if (!isActive) {
      return null;
    }

    return (
      <FormActionComponent
        onClick={this.handleClose}
        icon="cancel"
        title={null}
        extraClass="history-viewer__close-button"
      />
    );
  }

  /**
   * Renders the "actions" menu for the detail view. This menu may contain a compare mode toggle
   * and/or a "clear" button to clear the current selected version
   *
   * @returns {DOMElement}
   */
  renderActions() {
    const { isActive, compare } = this.props;

    if (!isActive && !compare) {
      return (
        <span className="history-viewer__actions" />
      );
    }

    return (
      <span className="history-viewer__actions">
        {this.renderCompareButton()}
        {this.renderClearButton()}
      </span>
    );
  }

  render() {
    const { version, isActive, StateComponent } = this.props;

    const classnames = classNames({
      'history-viewer__row': true,
      'history-viewer__row--current': isActive,
    });

    const rowTitle = i18n._t('HistoryViewerVersion.GO_TO_VERSION', 'Go to version {version}');

    return (
      <li className={classnames}>
        <a
          href={null}
          className="history-viewer__version-anchor"
          title={i18n.inject(rowTitle, { version: version.Version })}
          onClick={this.handleClick}
        >
          <span className="history-viewer__version-no">{version.Version}</span>
          <StateComponent
            version={version}
            isActive={isActive}
          />
          <span className="history-viewer__author">{this.getAuthor()}</span>
          {this.renderActions()}
        </a>
      </li>
    );
  }
}

HistoryViewerVersion.propTypes = {
  version: versionType,
  isActive: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  enterCompareMode: React.PropTypes.func,
  compare: compareType,
  StateComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  FormActionComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

HistoryViewerVersion.defaultProps = {
  isActive: false,
  version: defaultVersion,
};

export { HistoryViewerVersion as Component };

function mapDispatchToProps(dispatch) {
  return {
    onSelect(selectedVersion, compare) {
      const { versionFrom } = compare;
      if (compare) {
        if (!versionFrom) {
          dispatch(setCompareFrom(selectedVersion));
        } else {
          dispatch(setCompareTo(selectedVersion));
        }
      } else {
        dispatch(showVersion(selectedVersion));
        dispatch(clearMessages());
      }
    },
    enterCompareMode(version) {
      dispatch(setCompareFrom(version));
      dispatch(setCompareMode(true));
    }
  };
}

export default compose(
  connect(null, mapDispatchToProps),
  inject(
    ['HistoryViewerVersionState', 'FormAction'],
    (StateComponent, FormActionComponent) => ({
      StateComponent,
      FormActionComponent,
    }),
    ({ version }) => {
      let context = 'VersionedAdmin.HistoryViewer.HistoryViewerVersion';
      if (version) {
        context += `.${version.Version}`;
      }
      return context;
    }
  )
)(HistoryViewerVersion);
