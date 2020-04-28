import { Local } from '../src/adapters/local';
import { join } from 'path';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
import { ReadFileResult } from '../src/types/local-adpater.types';
import { isDir } from '../src/util';

describe('local adapter test', function (): void {
  this.timeout(5000);

  it('test relative roots are supported', function () {
    new Local(join(__dirname, 'files/../files'));
  });

  describe('local adapter methods', function () {
    let adapter: Local;

    beforeEach(function () {
      const root = join(__dirname, 'files/');
      adapter = new Local(root);
    });

    describe('#has()', function () {
      it('test has with dir', async function () {
        const testDir = '0';

        await adapter.createDir(testDir);

        const hasDir = await adapter.has(testDir);

        expect(hasDir).to.be.equal(true);

        await adapter.deleteDir(testDir);
      });

      it('test has with file', async function () {
        const testFile = 'file.txt';

        await adapter.write(testFile, 'content');

        expect(await adapter.has(testFile)).to.be.eq(true);

        await adapter.delete(testFile);
      });
    });

    //describe('#write()', function () {});

    describe('#writeStream', function () {
      it('test write stream', async function () {
        const temp = `dir/${uniqueId('file_')}.txt`;
        await adapter.write(temp, 'dummy');
        const readStream = adapter.readStream(temp);
        const target = 'dir/file.txt';
        await adapter.writeStream(target, readStream.stream);

        expect(await adapter.has(target)).to.be.eq(true);

        const result = (await adapter.read(target)) as ReadFileResult;

        expect(result.contents.toString()).to.be.eq('dummy');

        await adapter.deleteDir('dir');
      });
    });

    describe('#readStream', function () {});

    describe('#updateStream', function () {});

    describe('#update', function () {});

    describe('#read', function () {});

    describe('#rename', function () {});

    describe('#copy', function () {});

    describe('#delete', function () {});

    describe('#listContents', function () {});

    describe('#getMetadata', function () {});

    describe('#getSize', function () {});

    describe('#getMimetype', function () {});

    describe('#getTimestamp', function () {});

    describe('#getVisibility', function () {});

    describe('#setVisibility', function () {});

    describe('#createDir', function () {});

    describe('#deleteDir', function () {
      it('test adapter delete dir ', async function () {
        await adapter.write('nested/dir/path.txt', 'contents');

        expect(await isDir(join(__dirname, 'files/nested/dir'))).to.be.eq(true);

        await adapter.deleteDir('nested');

        expect(await adapter.has('nested/dir/path.txt')).to.be.eq(false);

        expect(await isDir(join(__dirname, 'files/nested/dir'))).to.be.eq(false);
      });
    });
  });
});
