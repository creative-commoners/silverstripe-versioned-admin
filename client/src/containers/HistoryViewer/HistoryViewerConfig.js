import React from 'react';
import Config from 'lib/Config';
import { inject } from 'lib/Injector';

const historyViewerConfig = (HistoryViewer) => {
  class HistoryViewerConfigProvider extends React.Component {
    getConfig() {
      const sectionKey = 'SilverStripe\\VersionedAdmin\\Controllers\\HistoryViewerController';
      return Config.getSection(sectionKey);
    }

    getSchemaUrl() {
      const { compareMode } = this.props;
      const formName = compareMode ? 'compareForm' : 'versionForm';
      const schemaUrlBase = `${this.getConfig().form[formName].schemaUrl}/:id`;
      const schemaQueryVersion = compareMode ?
        'RecordVersionFrom=:from&RecordVersionTo=:to' :
        'RecordVersion=:version';
      const schemaQueryID = 'RecordClass=:class&RecordID=:id';
      return `${schemaUrlBase}?${schemaQueryID}&${schemaQueryVersion}`;
    }

    render() {
      const props = {
        ...this.props,
        config: this.getConfig(),
        HistoryViewer,
        schemaUrl: this.getSchemaUrl(),
      };

      return (
        <HistoryViewer
          {...props}
        />
      );
    }
  }

  return inject(
    ['HistoryViewer']
  )(HistoryViewerConfigProvider);
};

export default historyViewerConfig;
