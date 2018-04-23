import i18n from 'i18n';
import React from 'react';
import { inject } from 'lib/Injector';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class HistoryViewerHeading extends React.Component {
  constructor(props) {
  super(props);

  this.toggle = this.toggle.bind(this);
  this.draftFilterToggled = this.draftFilterToggled.bind(this);
  this.state = {
    dropdownOpen: false,
  };
  }

  toggle() {
    this.setState({
    dropdownOpen: !this.state.dropdownOpen
    });
  }

  draftFilterToggled(event, importantBits) {
		const { id, value } = importantBits;
		console.log('event', event, 'id', id, 'value', value);

// User chooses to show unpublished versions via checkbox
		if (value.length && value[0] === 'draft') {
      alert('do something');
		}
	}

	render() {
		const { CheckboxComponent } = this.props;

		const checkboxProps = {
      id: 'set',
      title: '',
      name: 'set',
      value: [''],
      source: [
	      { value: 'draft', title: 'Show unpublished' },
        { value: 'compare', title: 'Compare 2 versions' }
			],
		};

		return (
      <tr>
        <th>#</th>
        <th>{i18n._t('HistoryViewer.Record', 'Record')}</th>
        <th className="history-viewer_author_and_toggle">
					{i18n._t('HistoryViewer.Author', 'Author')}
					<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
            <DropdownToggle className="font-icon-sliders icon-only icon">
			      </DropdownToggle>
						<DropdownMenu right>
              <DropdownItem>
                <CheckboxComponent
                  {...checkboxProps}
                  onChange={this.draftFilterToggled} />
							</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </th>
        {this.props.hasActions ? <th /> : null}
      </tr>
    );
  }
}


HistoryViewerHeading.propTypes = {
  hasActions: React.PropTypes.bool,
  CheckboxComponent: React.PropTypes.oneOfType([React.PropTypes.func, ])
};

HistoryViewerHeading.defaultProps = {
  hasActions: false,
};

export default inject(
  /* dependencies */
  ['CheckboxSetField'],
  /* map dependencies to prop names */
  (CheckboxSetField) => ({
  CheckboxComponent: CheckboxSetField
  }),
  /* context */
  () => 'VersionedAdmin.HistoryViewer.HistoryViewerHeading'
)(HistoryViewerHeading);
