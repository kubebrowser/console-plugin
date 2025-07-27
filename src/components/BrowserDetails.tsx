import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  PageSection,
  Switch,
} from '@patternfly/react-core';
import * as React from 'react';
import { FC } from 'react';
import { K8sBrowser } from '../types/browser';
import { BrowserStatusIndicator } from './BrowserStatusIcon';
import { ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { deploymentGVK, namespaceGVK } from '../utils/gvk';

export const BrowserDetails: FC<{ browser: K8sBrowser }> = ({ browser }) => {
  const [isLoading, setLoading] = React.useState(false);
  function handleStartedChange(_e, checked: boolean) {
    if (isLoading) return;
    setLoading(true);
    console.log(browser.spec.started);
    // update resource;
    setLoading(false);
  }
  return (
    <PageSection style={{ backgroundColor: 'transparent' }}>
      <DescriptionList
        columnModifier={{
          default: '2Col',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{browser.metadata.name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Started</DescriptionListTerm>
          <DescriptionListDescription>
            <Switch
              id="no-label-switch-on"
              aria-label="Togglable option for no visible label example"
              isChecked={!!browser.spec.started}
              onChange={handleStartedChange}
              isDisabled={isLoading}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Namespace</DescriptionListTerm>
          <DescriptionListDescription>
            <ResourceLink name={browser.metadata.namespace} groupVersionKind={namespaceGVK} />
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Deployment</DescriptionListTerm>
          <DescriptionListDescription>
            <ResourceLink
              name={browser.metadata.name}
              namespace={browser.metadata.namespace}
              groupVersionKind={deploymentGVK}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Date Created</DescriptionListTerm>
          <DescriptionListDescription>
            <Timestamp timestamp={browser.metadata.creationTimestamp} />
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            {browser.status.deploymentStatus ? (
              <Flex alignSelf={{ default: 'alignSelfCenter' }} flexWrap={{ default: 'nowrap' }}>
                <FlexItem
                  spacer={{ default: 'spacerSm' }}
                  alignSelf={{ default: 'alignSelfCenter' }}
                >
                  <BrowserStatusIndicator status={browser.status.deploymentStatus} />
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                  <span style={{ position: 'relative', top: '1px' }}>
                    {browser.status.deploymentStatus}
                  </span>
                </FlexItem>
              </Flex>
            ) : (
              <span>Unknown</span>
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};
