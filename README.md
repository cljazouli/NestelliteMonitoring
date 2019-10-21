<p align="center" style="margin: 0">
  <img src="https://i.imgur.com/5rcY2gJ.png">
</p>
<p align="center" style="margin: 0">
  <img src="https://img.shields.io/badge/Node.js-v10.16.0-success.svg">
  <img src="https://img.shields.io/badge/Express.js-v4.17.1-blue.svg">
  <img src="https://img.shields.io/badge/moment-v2.24.0-important.svg">
</p>
<br/>

## Node.js backend for checking the stats and health of Nestio's Satellite

#### Prerequisites
Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js
This web application requires `Node.js` version 10.16.0 or higher.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).


## Installation

### Clone The Repository

``` bash
# clone the repo
$ git clone https://github.com/cljazouli/NestelliteMonitoring.git

# go into app's directory
$ cd NestelliteMonitoring

# install app's dependencies
$ npm install
```

## Create the Environment File

Before running the Nestellite back-end make sure to create an environment file named '.env' in the root of the project (if not already existing).
The environment variable should contain the following variable:
- NESTIO_SPACE_ENDPOINT: URL of the Nestio's API for the real-time information about the satellite.
- UPDATE_INTERVAL: Interval in ms that Nestio refreshes it's data from the API.
- DANGEROUS_ALTITUDE: Average altitude in km of the satellite should raise a warning if stayed more than 1 minute.
- UPDATE_HEALTH_INTERVAL: Interval in ms to update the health API.

example of the .env file:

```js
NESTIO_SPACE_ENDPOINT = http://nestio.space/api/satellite/data
UPDATE_INTERVAL = 10000
DANGEROUS_ALTITUDE = 160
UPDATE_HEALTH_INTERVAL = 60000
```


## Usage in Development Environment

``` bash
# cd to the repository folder
# Run the webapp on a defined port (example: 5100). Default port 8080.
$ PORT=5100 node index.js
```


## Documentation

You can find the [API Documentation](https://github.com/cljazouli/NestelliteMonitoring/wiki/API-Documentation) on the Wiki.



## Creators

**Chakib Ljazouli**

* <ljazouli.c@gmail.com>



## Copyright and license

All the NestelliteMonitoring Code is released under [the GNU General Public License](https://github.com/cljazouli/ngSIP/blob/master/LICENSE.txt).

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

THIS REPOSITORY IS ONLY CREATED FOR A CODING CHALLENGE PURPOSES AND IS NOT ANY CASE USED IN PRODUCTION OR RELATED TO NESTIO ACTIVITY.


----------------
