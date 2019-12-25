import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './modules/Layout'
import { MOUNT_NODE } from './global/constants'

ReactDOM.render(<Layout />, document.getElementById(MOUNT_NODE))
