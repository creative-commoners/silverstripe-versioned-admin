import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { setCompareMode } from 'state/historyviewer/HistoryViewerActions';
import { compose } from "redux";
import { connect } from "react-redux";

class HistoryViewerHeading extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleCompareModeChange = this.handleCompareModeChange.bind(this);

    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleCompareModeChange(event) {
    const checkbox = event.target;
    if (checkbox.checked) {
      this.props.onCompareModeSelect();
    }
    else {
      this.props.onCompareModeUnSelect();
    }
  }

  render() {

    const { compareModeSelected } = this.props;
    return (
      <tr className="history-viewer__heading">
        <th>#</th>
        <th>{i18n._t('HistoryViewer.Record', 'Record')}</th>
        <th className="author-compare-toggle__container">
          <span className="author-span">{i18n._t('HistoryViewer.Author', 'Author')}</span>
          <Dropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.toggle}
            className="compare-dropdown"
            right
          >
            <DropdownToggle
              className="font-icon-sliders"
            >
            </DropdownToggle>
            <DropdownMenu>
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={compareModeSelected}
                  onChange={this.handleCompareModeChange}
                />
                <label className="form-check-label" htmlFor="exampleCheck1"> Compare 2 versions</label>
              </div>
            </DropdownMenu>
          </Dropdown>
        </th>
        {this.props.hasActions ? <th/> : null}

      </tr>
    );
  }
}

HistoryViewerHeading.propTypes = {
  hasActions: React.PropTypes.bool,
  compareModeSelected: React.PropTypes.bool,
};

HistoryViewerHeading.defaultProps = {
  hasActions: false,
};

function mapStateToProps(state) {
  return {
    compareModeSelected: state.versionedAdmin.historyViewer.compareMode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCompareModeSelect() {
      dispatch(setCompareMode(true));
    },
    onCompareModeUnSelect() {
      dispatch(setCompareMode(false));
    }
  }
}

export { HistoryViewerHeading as Component };
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(HistoryViewerHeading);
