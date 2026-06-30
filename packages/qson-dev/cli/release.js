#!/usr/bin/env node
import { clean, build, release, incrementVersion } from "../esm/build-utils.js";

clean();
build();
release();
incrementVersion();
