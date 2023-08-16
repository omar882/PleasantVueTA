# PleasantVue

A better looking and easier to use version of StudentVue using [StudentVue.js](https://github.com/StudentVue/StudentVue.js) and [Sveltekit](https://kit.svelte.dev).

This app stores your login info as a cookie in your browser and nowhere else. It is not persisted on any server.

PleasantVue was created and is maintained by Amador Valley seniors Ryan Vir and Aayuman Ghangurde.

## Attribution
PleasantVue is a fork of [gradenight](https://github.com/refact0r/gradenight) by refact0r and contributors.

Thanks to [StudentVue maintainers](https://github.com/StudentVue) for `studentvue.js` and documentation

This project is licensed under the GPL 3 license, see `LICENSE` for the full license.

## Self-Hosting
install PNPM, and run a mongodb. Create a .env file with the following contents
```
PRIVATE_PEPPER=<LONG BASE64 STRING>
PRIVATE_MONGODB_URI=mongodb://127.0.0.1
PUBLIC_SYNERGY_BACKEND=https://ca-pleas-psv.edupoint.com/
PRIVATE_SYNERGY_BACKEND=https://ca-pleas-psv.edupoint.com/
SECRET_SCREENSHOT_SERVER=http://127.0.0.1:5081/render
SECRET_SCREENSHOT_SERVER_TOKEN=<LONG BASE64 STRING>
PUBLIC_URL=http://127.0.0.1:5173/
```
### IMPORTANT NOTICE
You run this server at your own risk. If you decide to deploy this server, you are taking liability upon yourself for bringing the service up. This program comes with NO WARRANTY:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
