import React from 'react';
import RBListGroupItem, { ListGroupItemProps } from 'react-bootstrap/ListGroupItem';
import { Link, LinkProps } from '@reach/router';

export function ListGroupItem(props: React.PropsWithoutRef<ListGroupItemProps & LinkProps<{}>>) {
    return (
        <RBListGroupItem {...props} as={Link} />
    );
}
